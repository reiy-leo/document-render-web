---
title: Reading Word back into JSON
description: document-render parse reads a .docx into document-render JSON and exports images next to it — what it reads, how styles are folded, and what isn't supported yet.
sidebar:
  order: 10
---

`document-render parse` works the other way round: it reads a `.docx` into document-render JSON. The result has the same shape as `render`'s input (flat `elements` plus `root`), so you can edit the content or switch style sets and render it again to docx, pdf or html.

```sh
document-render parse report.docx -o report.json                   # images go to report.assets/
document-render parse report.docx > report.json                    # without -o, JSON goes to stdout and images to ./report.assets/
document-render parse report.docx -o out/report.json --assets img  # images go to out/img/
```

Options: [Command line](/en/reference/cli/#parse).

The goal is that parse followed by render back to docx looks about the same. Anything it can't recognize or express produces a warning on stderr; parsing doesn't stop. Only docx is read; pdf can't be read back into JSON.

## What it reads

| Content | Becomes |
|---|---|
| Headings | Paragraphs styled "Heading 1" to "Heading 6" (or whose style has an outline level) become Heading |
| Body text and inline styles | Font, size, color, bold, italic, underline, strikethrough, super/subscript, caps, letter spacing, scale, highlight, shading, emphasis marks, hidden; links (hyperlinks and HYPERLINK fields); runs with a character style named InlineCode become inline code |
| Paragraph formatting | Alignment, space before and after, line spacing, indents, keep with next, keep lines together, page break before, widow control, borders and shading |
| Lists | Numbering from numbering.xml becomes List: ordered or not, nesting, per-level number type, number template, start value, indents, marker color and size |
| Tables | Merged cells (gridSpan, vMerge), column widths, row heights, per-cell shading, borders, alignment, vertical text, margins |
| Images | Inline images and images on their own line are exported as files, referenced by relative path; floating images become `float` or `absolute` by position |
| Sections | Paper size and orientation, margins, header and footer distance, columns, different first page, different odd and even pages, page-number start and format |
| Headers and footers | Read as elements with ids like `header1`, `footer1` |
| Fields and breaks | Page numbers (PAGE, NUMPAGES, SECTIONPAGES fields), page breaks, column breaks (as ColumnBreak), table of contents (TOC field as TableOfContents) |
| Borders | All 25 Word line styles map back to document-render names; `single` becomes `solid` |
| Equations | OMML converted to LaTeX: an equation on its own line becomes Math (numbered ones too), one inside text becomes InlineMath |

Some details:

- **Line spacing**: Word's "Multiple" spacing becomes `{ "multiple": factor }`, which multiplies the font's own single line height, as Word does. See [Values](/en/reference/units/).
- **Indents**: character-based indents are written in `em`.
- **Table header**: recognized by Word's "Repeat as header row" (`w:tblHeader`). If the first row has it, it becomes the `columns` header; if it had no shading, `parts.header` gets `"background": "none"`, otherwise the shading is kept. A first row without it is an ordinary row. If several rows have it, only the first becomes the header, with a warning.
- **Alt text**: read from the image's descr, falling back to title. Image gets `alt`; inline images get `text`.
- **Page number formats**: `decimal`, `lowerRoman`, `upperRoman`, `lowerLetter`, `upperLetter` and `chineseCounting` are recognized; other formats warn and fall back to Arabic numerals.
- **Sections**: the first section goes into `meta.page`; each later section becomes a Section that only lists the paper settings that differ from the previous one.
- **Equations**: unrecognized structures warn and keep only the text.

## How styles are folded

parse doesn't load every paragraph with a long list of styles:

1. It first resolves the formatting each paragraph and run actually uses, following Word's rules.
2. It only writes fields that differ from what you'd get without them.
3. The font, size and line spacing shared by most body paragraphs go into `Document` under `styles`; body space before/after and first-line indent go into `Text`; heading levels go into keys like `Heading.1`.
4. Other Word paragraph and character styles in use become named styles with the same name, referenced from elements by `style`. If a name clashes with a component name, it gets a `Word ` prefix.
5. Fonts are always written by their English family name: 宋体 becomes SimSun, 微软雅黑 becomes Microsoft YaHei, and theme fonts resolve to the actual theme font.

## Not supported yet

These can't be read and produce warnings:

- Text boxes, shapes, WordArt, charts, SmartArt. Embedded objects (e.g. MathType equations) keep only their preview image.
- Footnotes, endnotes, comments, tracked changes. Deleted text from tracked changes is dropped; inserted text is kept.
- Tab stops (tab characters stay in the text), page vertical alignment, continuous section breaks.
- Conditional formatting in table styles (first row, banded rows and so on), centered tables, diagonal cell borders. Nested tables: their text is appended to the cell.
- Line-grid snapping: when a Word document's `docGrid` type is lines, Word rounds line heights to whole grid lines; parse doesn't do this and warns.
- Things the renderers can't express can't be read back either, e.g. in Word one list level has only one numbering definition.
