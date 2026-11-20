---
title: Format support
description: Where the same JSON differs between docx, pdf, html and Markdown — support tables for components, images, formulas, style fields, pagination and headers/footers, plus next-release changes.
sidebar:
  order: 10
---

The same JSON aims to look the same in all three formats. Markdown keeps structure only; see the "Markdown" section below. Styles a format can't express are ignored with a warning (once per field), never an error.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

## How each format is produced

| | docx | pdf | html |
|---|---|---|---|
| Engine | docx-rs | converted to Typst, then compiled | hand-built HTML with its own CSS |
| Fonts | names only; the reader's computer supplies them | found on the rendering machine and embedded | left to the browser |
| Images | packed into the file | packed into the file | local images as `data:` URIs |
| Page breaks | ✓ | ✓ | when printing or with `--paged` |
| Headers, footers, page numbers | Word fields, computed on open | computed after layout | only with `--paged` |

## Components

| Component | docx | pdf | html |
|---|---|---|---|
| Heading | ✓ also gets Word "Heading 1–6" | ✓ | ✓ |
| Text, Code, List | ✓ | ✓ | ✓ |
| Math, InlineMath | Word equations (OMML), editable | Typst math | MathML, no scripts |
| Code `lineNumbers` | ✓ | ✓ | ✓ |
| Table | ✓ part styles written per cell | ✓ | ✓ |
| Image | png, jpeg, gif, webp only | no URLs | ✓ |
| PageBreak | ✓ | ✓ | when printing or with `--paged` |
| ColumnBreak | column break; page break in a section without columns | `colbreak()`; page break in a section without columns | ✓ in columns; — without columns |
| Divider, Quote, Callout | ✓ padding and line width go into the indent; `radius` ✗ | ✓ | ✓ |
| TableOfContents | Word TOC field; page numbers after updating fields | ✓ page numbers computed, clickable | links; page numbers with `--paged` |
| Section | ✓ extra empty paragraph at each section end holds its settings | ✓ | with `--paged`; printing uses the first section's paper |
| Slide | level-2 heading plus content, then a page break; `body` part ✗ | one per page | one per page (16:9 box) |

## Images

| | docx | pdf | html |
|---|---|---|---|
| png, jpeg, gif, webp | ✓ | ✓ | ✓ |
| svg | ✗, shows alt | ✓ | ✓ |
| URLs | ✗, shows alt | ✗, shows alt | ✓ |
| `float` wrapping | ✓ | ✗, left/right alignment only | ✓ |
| `objectFit` | ✗ | ✓ | ✓ |
| `opacity` | ✗ | ✗ | ✓ |

## Text fields

| Field | docx | pdf | html |
|---|---|---|---|
| `fontFamily` fallback lists | first name only | ✓ | ✓ |
| `italic` | ✓ | CJK fonts have no italic | ✓ |
| `underline` double, wavy | ✓ | drawn single, ✗ | ✓ |
| `underlineColor` | ✗ | ✓ | ✓ |
| `strike: "double"` | ✓ | drawn single, ✗ | ✓ |
| `caps: "small"` | ✗ | ✓ | ✓ |
| `emphasisMark` | ✗ | ✗ | ✓ |
| `scale` | ✓ | ✗ | ✗ |
| `kerning` | ✗ | ✓ | ✓ |
| `lang` | — | ✓ | ✓ |
| color alpha | — | ✓ | ✓ |

## Paragraph fields

| Field | docx | pdf | html |
|---|---|---|---|
| `align: "distribute"` | ✓ | as `justify`, ✗ | ✓ |
| `lineHeight`, all forms | ✓ Word computes it | ✓ computed with Word's rules | ✓ computed with Word's rules; baseline position is up to the browser |
| `autoSpace` | ✗ | ✓ | ✓ |
| `kinsoku` | ✗ | — on by default | ✓ |
| `wrap: false` | ✗ | ✗ | ✓ |
| `outlineLevel` | ✓ | — | — |
| `contextualSpacing` | ✗ | ✗ | ✗ |
| `borderBetween` | ✓ | ✗ | ✗ |

## Box and background

| Field | docx | pdf | html |
|---|---|---|---|
| paragraph `padding` | only with a border (the built-in Code style warns for this reason) | ✓ | ✓ |
| `radius` | ✗ | ✓ | ✓ |
| `background` pattern | ✓ | blended to solid | blended to solid |
| `background` gradient | first color | ✓ | ✓ |
| all 25 border line styles | ✓ | ✓ multi-line styles as separate solid lines, dash-dot and wave as patterns | ✓ SVG patterns where CSS has none |
| `background: "none"` | ✓ | ✓ | ✓ |
| `borderDiagonal` | not implemented | not implemented | not implemented |
| `textRotation` | table cells only | ✓ | ✓ |

## Lists, tables, page

| Field | docx | pdf | html |
|---|---|---|---|
| `listMarkerImage` | ✗ | ✓ | ✓ |
| `listMarkerGap` as a length | as `tab`, ✗ | ✓ | ✓ |
| `tableLayout` | ✓ | — | ✓ |
| `rowBreak: false` | ✓ | ✗ | ✓ |
| exact row height | ✓ | ✓ | as minimum |
| minimum row height | ✓ | single-line cells only | ✓ |
| repeated header | ✓ | ✓ | when printing or with `--paged` |
| `meta.title` / `author` / `lang` | — | ✓ | ✓ |

## pdf fonts

- Default CJK fonts are tried in this order: PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC. YaHei comes early because Windows has no PingFang SC and Word substitutes YaHei when opening the docx, so pdf matches Windows Word.
- If none is found, Typst's bundled fonts are used and CJK characters may be missing.
- Your own `fontFamily` goes in front of the default list.

## Markdown

`-o report.md` or `-f md` writes Markdown in GitHub's flavor (GFM). Markdown has no styling, so only the structure is kept. Useful for READMEs, feeding to AI, or diffs.

| Content | Written as |
|---|---|
| Heading | `#` to `######` |
| Text | A paragraph; line breaks in the text become a trailing backslash |
| Bold, italic, strike, super/subscript, links, inline code | `**`, `*`, `~~`, `<sup>` `<sub>`, `[text](url)`, backticks; nothing is marked when it matches the paragraph itself |
| List | `1.` and `-`, nested lists indented to the parent's text |
| Table | A GFM table when it has a header row and no merged cells; otherwise an inline HTML table |
| Code | A fenced block with the language; `lineNumbers` is ignored |
| Quote | `>` |
| Callout | A GitHub alert `> [!NOTE]`; 💡 becomes TIP, ⚠️ WARNING, ❗ IMPORTANT, ⛔ 🚫 CAUTION; other icons stay in front of the text |
| Divider | `---` |
| Math, InlineMath | `$$…$$` as its own block (numbers as `\tag{1}`), `$…$` |
| TableOfContents | A list of links to the headings; each heading it lists gets an `<a id>` anchor |
| Image | `![alt](src)` with the path as written, not embedded; `caption` becomes an italic line below |
| Section, Slide | Content only; a Slide's `title` becomes a level-2 heading |

Dropped with a warning: PageBreak, ColumnBreak, headers and footers, page-number fields. Dropped silently: fonts, sizes, colors, spacing, borders, alignment and other styling.

## Next release

This is already in the code but not released yet (latest release: `v0.1.0-alpha.4`):

- Superscript and subscript: size and raise come from the superscript and subscript values built into the font, as in Word; with Chinese text the East Asian font's values are used. In `v0.1.0-alpha.4` html always shrinks to 0.75 of the font size and pdf uses Typst's default.
