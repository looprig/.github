// Package assertoutput provides small runtime assertions for executable docs.
package assertoutput

import (
	"fmt"
	"strings"
)

// MustEqual panics with a named diagnostic when comparable values differ.
func MustEqual[T comparable](name string, got, want T) {
	if got != want {
		panic(fmt.Sprintf("%s: got %#v, want %#v", name, got, want))
	}
}

// MustContain panics when text does not contain the expected fragment.
func MustContain(name, text, fragment string) {
	if !strings.Contains(text, fragment) {
		panic(fmt.Sprintf("%s: %q does not contain %q", name, text, fragment))
	}
}

// MustSucceed panics when err is non-nil.
func MustSucceed(err error) {
	if err != nil {
		panic(fmt.Sprintf("unexpected error: %v", err))
	}
}
