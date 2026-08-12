package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go/ast"
	"go/format"
	"go/parser"
	"go/token"
	"os"
	"sort"
	"strings"
	"unicode"
)

type sourceFile struct {
	Name   string `json:"name"`
	Source string `json:"source"`
}

type packageInput struct {
	ID    string       `json:"id"`
	Files []sourceFile `json:"files"`
}

type input struct {
	Packages []packageInput `json:"packages"`
}

type declaration struct {
	Name        string `json:"name"`
	Receiver    string `json:"receiver,omitempty"`
	Signature   string `json:"signature,omitempty"`
	Declaration string `json:"declaration,omitempty"`
	File        string `json:"file"`
}

type surface struct {
	ID        string        `json:"id"`
	Functions []declaration `json:"functions"`
	Methods   []declaration `json:"methods"`
	Types     []declaration `json:"types"`
	Constants []declaration `json:"constants"`
	Variables []declaration `json:"variables"`
	Errors    []string      `json:"errors"`
}

type output struct {
	Packages []surface `json:"packages"`
}

type parsedFile struct {
	name string
	file *ast.File
}

func exported(name string) bool {
	runes := []rune(name)
	return len(runes) > 0 && unicode.IsUpper(runes[0])
}

func baseType(expr ast.Expr) string {
	switch value := expr.(type) {
	case *ast.Ident:
		return value.Name
	case *ast.StarExpr:
		return baseType(value.X)
	case *ast.IndexExpr:
		return baseType(value.X)
	case *ast.IndexListExpr:
		return baseType(value.X)
	case *ast.ParenExpr:
		return baseType(value.X)
	default:
		return ""
	}
}

func rendered(fset *token.FileSet, node any) (string, error) {
	var buffer bytes.Buffer
	if err := format.Node(&buffer, fset, node); err != nil {
		return "", err
	}
	return strings.TrimSpace(buffer.String()), nil
}

func embeddedExported(expr ast.Expr) bool {
	switch value := expr.(type) {
	case *ast.Ident:
		return exported(value.Name)
	case *ast.SelectorExpr:
		return exported(value.Sel.Name)
	case *ast.StarExpr:
		return embeddedExported(value.X)
	case *ast.IndexExpr:
		return embeddedExported(value.X)
	case *ast.IndexListExpr:
		return embeddedExported(value.X)
	case *ast.ParenExpr:
		return embeddedExported(value.X)
	default:
		return false
	}
}

func publicTypeDeclaration(fset *token.FileSet, spec *ast.TypeSpec) (string, error) {
	copySpec := *spec
	filtered := false
	if structure, ok := spec.Type.(*ast.StructType); ok {
		copyStruct := *structure
		copyFields := &ast.FieldList{Opening: structure.Fields.Opening, Closing: structure.Fields.Closing}
		for _, field := range structure.Fields.List {
			copyField := *field
			copyField.Doc = nil
			copyField.Comment = nil
			if len(field.Names) == 0 {
				if embeddedExported(field.Type) {
					copyFields.List = append(copyFields.List, &copyField)
				} else {
					filtered = true
				}
				continue
			}
			copyField.Names = nil
			for _, name := range field.Names {
				if exported(name.Name) {
					copyField.Names = append(copyField.Names, name)
				} else {
					filtered = true
				}
			}
			if len(copyField.Names) > 0 {
				copyFields.List = append(copyFields.List, &copyField)
			}
		}
		copyStruct.Fields = copyFields
		copySpec.Type = &copyStruct
	}
	general := &ast.GenDecl{Tok: token.TYPE, Specs: []ast.Spec{&copySpec}}
	text, err := rendered(fset, general)
	if err != nil || !filtered {
		return text, err
	}
	closing := strings.LastIndex(text, "}")
	if closing < 0 {
		return text, nil
	}
	prefix := strings.TrimRight(text[:closing], " \t\r\n")
	return prefix + "\n\t// contains filtered or unexported fields\n}" + text[closing+1:], nil
}

func compactSignature(value string) string {
	value = strings.Join(strings.Fields(value), " ")
	replacer := strings.NewReplacer("( ", "(", " )", ")", "[ ", "[", " ]", "]", ",)", ")", ", )", ")")
	return replacer.Replace(value)
}

func receiverText(fset *token.FileSet, decl *ast.FuncDecl) (string, error) {
	if decl.Recv == nil || len(decl.Recv.List) == 0 {
		return "", nil
	}
	field := decl.Recv.List[0]
	typeText, err := rendered(fset, field.Type)
	if err != nil {
		return "", err
	}
	if len(field.Names) == 0 {
		return "(" + typeText + ")", nil
	}
	return "(" + field.Names[0].Name + " " + typeText + ")", nil
}

func isErrorMethod(decl *ast.FuncDecl) bool {
	if decl.Name.Name != "Error" || decl.Type.Params.NumFields() != 0 || decl.Type.Results == nil || len(decl.Type.Results.List) != 1 {
		return false
	}
	result, ok := decl.Type.Results.List[0].Type.(*ast.Ident)
	return ok && result.Name == "string"
}

func analyzePackage(item packageInput) (surface, error) {
	fset := token.NewFileSet()
	files := make([]parsedFile, 0, len(item.Files))
	for _, source := range item.Files {
		file, err := parser.ParseFile(fset, source.Name, source.Source, parser.SkipObjectResolution)
		if err != nil {
			return surface{}, fmt.Errorf("parse %s: %w", source.Name, err)
		}
		files = append(files, parsedFile{name: source.Name, file: file})
	}

	aliases := map[string][]string{}
	for _, parsed := range files {
		for _, decl := range parsed.file.Decls {
			general, ok := decl.(*ast.GenDecl)
			if !ok || general.Tok != token.TYPE {
				continue
			}
			for _, raw := range general.Specs {
				spec := raw.(*ast.TypeSpec)
				if spec.Assign.IsValid() && exported(spec.Name.Name) {
					target := baseType(spec.Type)
					if target != "" && !exported(target) {
						aliases[target] = append(aliases[target], spec.Name.Name)
					}
				}
			}
		}
	}

	result := surface{ID: item.ID, Functions: []declaration{}, Methods: []declaration{}, Types: []declaration{}, Constants: []declaration{}, Variables: []declaration{}, Errors: []string{}}
	errorNames := map[string]bool{}
	for _, parsed := range files {
		for _, rawDecl := range parsed.file.Decls {
			switch decl := rawDecl.(type) {
			case *ast.FuncDecl:
				if !exported(decl.Name.Name) {
					continue
				}
				copy := *decl
				copy.Doc = nil
				copy.Body = nil
				signature, err := rendered(fset, &copy)
				if err != nil {
					return surface{}, err
				}
				entry := declaration{Name: decl.Name.Name, Signature: compactSignature(signature), File: parsed.name}
				if decl.Recv == nil {
					result.Functions = append(result.Functions, entry)
					continue
				}
				receiver := baseType(decl.Recv.List[0].Type)
				if !exported(receiver) && len(aliases[receiver]) == 0 {
					continue
				}
				entry.Receiver, err = receiverText(fset, decl)
				if err != nil {
					return surface{}, err
				}
				result.Methods = append(result.Methods, entry)
				if isErrorMethod(decl) {
					if exported(receiver) {
						errorNames[receiver] = true
					} else {
						for _, alias := range aliases[receiver] {
							errorNames[alias] = true
						}
					}
				}
			case *ast.GenDecl:
				for _, raw := range decl.Specs {
					switch spec := raw.(type) {
					case *ast.TypeSpec:
						if !exported(spec.Name.Name) {
							continue
						}
						text, err := publicTypeDeclaration(fset, spec)
						if err != nil {
							return surface{}, err
						}
						result.Types = append(result.Types, declaration{Name: spec.Name.Name, Declaration: text, File: parsed.name})
					case *ast.ValueSpec:
						target := &result.Variables
						if decl.Tok == token.CONST {
							target = &result.Constants
						} else if decl.Tok != token.VAR {
							continue
						}
						for _, name := range spec.Names {
							if exported(name.Name) {
								*target = append(*target, declaration{Name: name.Name, File: parsed.name})
							}
						}
					}
				}
			}
		}
	}
	for name := range errorNames {
		result.Errors = append(result.Errors, name)
	}
	sort.Strings(result.Errors)
	for index := range result.Types {
		if errorNames[result.Types[index].Name] {
			// The Node inventory preserves this as the existing per-type error flag.
		}
	}
	return result, nil
}

func main() {
	var request input
	if err := json.NewDecoder(os.Stdin).Decode(&request); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	response := output{Packages: make([]surface, 0, len(request.Packages))}
	for _, item := range request.Packages {
		value, err := analyzePackage(item)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		response.Packages = append(response.Packages, value)
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetEscapeHTML(false)
	if err := encoder.Encode(response); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
