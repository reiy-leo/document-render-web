---
title: Command line
description: document-render commands and options — render, check, catalog, parse — plus stdin/stdout, auto-loaded directories and the debug variable.
sidebar:
  order: 1
---

```sh
document-render render <input> -o <output> [options]
document-render check <input> [options]
document-render catalog [--json] [--catalog <path>]...
document-render parse <docx> [-o <json>] [--assets <dir>]
document-render --version
document-render --help
```

Messages and help text are in Chinese for now.

## render

Renders JSON to a file.

```sh
document-render render report.json -o report.docx
document-render render report.json -o report.html --paged
document-render render report.json -o report.md
document-render render report.json -o report.pdf --style-sets themes/ --style-set formal
```

| Option | Meaning |
|---|---|
| `<input>` | JSON file. `-` reads from stdin |
| `-o, --output <file>` | Output file, required. The extension picks the format: `.docx`, `.pdf`, `.html` or `.htm`, `.md`. `-` writes to stdout and then needs `--format` |
| `-f, --format <fmt>` | Force a format: `html`, `docx`, `pdf`, `md`, case-insensitive. Otherwise taken from the output extension |
| `--paged` | html only: embed Paged.js so the page displays as pages |
| `--catalog <path>` | Custom component definition file or directory; repeatable |
| `--style-sets <path>` | Style set file or directory; repeatable |
| `--style-set <name>` | Style set to use; overrides the document's `styleSet` |

Pipe in, pipe out:

```sh
cat report.json | document-render render - -o - -f pdf > report.pdf
```

`.md` produces GitHub-flavored Markdown (GFM) with structure only, no styling; see [Format support](/en/reference/format-support/#markdown).

`xlsx` and `pptx` arrive in version 2; those extensions are errors for now.

### --paged

By default html is one long page; page breaks, headers, footers and repeated table headers only appear when printing. With `--paged`:

- Pages are cut using the paper and margins from `meta.page`; content after `PageBreak` starts a new page.
- Tables that cross pages repeat their header (unless `repeatHeader: false`).
- Headers and footers are shown with page numbers filled in.
- When layout finishes, `<html>` gets `data-document-render-ready="1"`. Screenshot or print scripts can wait for it.
- Paged.js (MIT, 0.4.3) is bundled in the binary and works offline. Files grow by about 500 KB and take a moment to lay out when opened.
- Mixed portrait/landscape looks right on screen, but printing uses the first section's paper.

## check

Validates without writing a file. Accepts the same `--catalog`, `--style-sets` and `--style-set` as `render`.

```sh
document-render check report.json
# ok：展开后 12 个元素
```

The message means "ok: 12 elements after expansion", i.e. after custom components are expanded into built-ins. LaTeX formulas that can't be parsed are listed as warnings; they don't fail the check.

## catalog

Lists available components.

```sh
document-render catalog
document-render catalog --json
document-render catalog --catalog my-components/
```

| Option | Meaning |
|---|---|
| `--json` | Print each component's props JSON Schema, plus `description` and `container` |
| `--catalog <path>` | Also list custom components from these definitions; repeatable |

`catalog` does not read a `catalog/` directory automatically; pass it with `--catalog`.

## parse

Reads a `.docx` into document-render JSON and exports images to a directory next to the JSON. What it can read: [Reading Word back into JSON](/en/guide/parse/).

```sh
document-render parse report.docx -o report.json                   # images go to report.assets/
document-render parse report.docx > report.json                    # JSON to stdout
document-render parse report.docx -o out/report.json --assets img  # images go to out/img/
```

| Option | Meaning |
|---|---|
| `<input>` | docx file. `-` reads from stdin |
| `-o, --output <file>` | Output JSON file. Omitted or `-` writes to stdout |
| `--assets <dir>` | Where to export images, relative to the JSON's directory. Default "JSON file name.assets", e.g. `report.assets/` |

- Image paths in the JSON are relative, so keep the JSON and its image directory together to render again.
- When writing to stdout, the image directory is relative to the current directory and named after the input docx; from stdin it is `document.assets/`.
- No directory is created when the document has no images.
- Anything it can't read produces a warning on stderr starting with "警告：" (warning); parsing doesn't stop.

## mcp

:::caution[Not implemented yet]
`document-render mcp` (run as an MCP server) isn't built yet; running it is an error.
:::

## Auto-loaded directories

`render` and `check` automatically read these directories next to **the document**:

| Directory | Contents |
|---|---|
| `catalog/` | Custom component definitions, one per file |
| `styles/` | Style set files, each with a `name` |

Only `.json` files, no subdirectories. When the document comes from stdin there is no document directory, so nothing is auto-loaded.

Relative image paths also resolve from the document's directory.

## Output and exit codes

- Warnings go to stderr, prefixed with `警告：` ("Warning:"). Each unsupported field is reported once per format.
- On success it prints `已生成 <file>` ("Wrote <file>") and exits 0.
- On error it prints the reason (with element ids), exits non-zero and writes no file.

## Debugging

For pdf output, set `DOCUMENT_RENDER_DEBUG_TYPST=1` to print the generated Typst source to stderr:

```sh
DOCUMENT_RENDER_DEBUG_TYPST=1 document-render render report.json -o report.pdf 2> report.typ.txt
```
