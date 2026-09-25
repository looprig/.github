---
id: guides/tui/styling/markdown
title: Markdown Rendering
description: Render assistant markdown with the static dark configuration, Nexus palette, and responsive table policy used by the TUI.
audience: developer
section: guides
order: 17
publication: released
proofs:
  renderer: release-github-com-looprig-tui
  static-dark-config: release-github-com-looprig-tui
  responsive-tables: release-github-com-looprig-tui
  rendering-contract: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Markdown Rendering

The styles package provides `NewMarkdownRenderer(width)` and `RenderMarkdown(renderer, markdown, width)`. The renderer uses Glamour's static dark configuration and the TUI's Nexus palette. It does not query terminal background state, because terminal probes can race Bubble Tea's raw input reader.

## Renderer

```go
renderer, err := styles.NewMarkdownRenderer(96)
if err != nil {
	return err
}

rendered, err := styles.RenderMarkdown(renderer, "## Result\n\n`value`", 96)
if err != nil {
	return err
}
fmt.Print(rendered)
```

The document margin is zeroed so narration aligns under the TUI's `●` bullet. Heading and inline-code colors use `MarkdownHeadingColor` and `MarkdownInlineCodeColor`. Code blocks use the Nexus Chroma palette. H2 through H6 markers are styled away while H1 retains its heading treatment.

## Static dark config

`NewMarkdownRenderer` deliberately avoids automatic terminal style detection. Auto detection can write OSC and cursor probes to the terminal and read replies from stdin. A Bubble Tea program owns stdin in raw mode, so those replies can leak into the frame, desynchronize the cursor, or stall input. A static configuration is deterministic and testable.

## Responsive tables

`RenderMarkdown` keeps the TUI's table policy outside Glamour. Tables that fit the requested width preserve Glamour's normal output. Wide tables switch to a responsive representation with readable rows, separators, and the same semantic colors. This policy belongs in the rendering helper so every screen and component gets the same behavior.

```go
markdown := "| Name | Description |\n| --- | --- |\n| adapter | durable session bridge |"
renderer, err := styles.NewMarkdownRenderer(48)
if err != nil {
	return err
}
view, err := styles.RenderMarkdown(renderer, markdown, 48)
if err != nil {
	return err
}
fmt.Println(view)
```

## Rendering contract

The helper returns a string and an error. It does not write to a terminal, own a viewport, or choose a frame width. The caller supplies the current width and decides whether the rendered result belongs in scrollback, an alt-screen viewport, or a custom component.

## Source

- [Markdown renderer](https://github.com/looprig/tui/blob/main/styles/styles.go)
- [Responsive table renderer](https://github.com/looprig/tui/blob/main/styles/markdown_tables.go)

## Proof

- [Markdown table tests](https://github.com/looprig/tui/blob/main/styles/markdown_tables_test.go)
- [Styles behavior tests](https://github.com/looprig/tui/blob/main/styles/styles_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
