---
title: Math
description: Write formulas in LaTeX — inline InlineMath in runs, display formulas with the Math component; docx gets Word equations, pdf uses Typst, html uses MathML, Markdown writes $…$.
sidebar:
  order: 9
---

Formulas are written in LaTeX, in two kinds:

- **InlineMath**: an inline formula inside runs, on the same line as the text.
- **Math**: a display formula on its own line, centered by default, optionally numbered.

```json
"intro": {
  "type": "Text",
  "props": { "text": ["Pythagoras: ", { "type": "InlineMath", "text": "a^2+b^2=c^2" }, "."] }
},
"quadratic": {
  "type": "Math",
  "props": { "latex": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", "number": 1 }
}
```

:::caution[Double the backslashes]
In a JSON string `\` must be written `\\`: `"\\frac"` is LaTeX's `\frac`.
:::

## InlineMath

Put `"type": "InlineMath"` on a run; `text` is LaTeX source, without `$`. Works in Text, Heading, list items and table cells.

```json
"text": ["Circle area ", { "type": "InlineMath", "text": "S=\\pi r^2" }, ", square root ", { "type": "InlineMath", "text": "\\sqrt{2}\\approx 1.414" }, "."]
```

- It follows the paragraph's text style (size, color, bold). Style it separately with the `InlineMath` component style.
- Inline formulas can't be links; `href` is ignored.

## Math

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `latex` | string | yes | LaTeX source, without `$$` |
| `number` | integer or string | no | Equation number; `1` shows "(1)" on the right |

```json
"e": { "type": "Math", "props": { "latex": "E = mc^2" }, "style": { "fontSize": 16, "color": "#1A73E8", "align": "left" } }
```

- Defaults: centered, 6pt before, 6pt after. `fontSize`, `color` and `align` can all be changed.

## Supported LaTeX

What works is defined by [math-core](https://github.com/tmke8/math-core); the common things do:

- Sub- and superscripts, `\frac`, `\sqrt`, `\sqrt[3]{}`, `\binom`
- `\sum`, `\prod`, `\int` with limits, `\lim`
- Greek letters, `\mathbf`, `\mathbb`, `\text`
- Stretchy brackets like `\left( \right)`
- Matrices like `pmatrix` and `bmatrix`, `cases`
- Accents like `\hat`, `\vec`, `\bar`; `\overline`, `\underbrace`

Bad LaTeX doesn't break the file: that formula shows its LaTeX source instead, with a warning. `document-render check` lists unparseable formulas as warnings too, so you catch them before rendering.

## How each format renders

| | docx | pdf | html | Markdown |
|---|---|---|---|---|
| Written as | Word equations (OMML), double-click to edit in Word | Typst math | MathML, no scripts, works offline | `$…$`, `$$…$$`, rendered by GitHub |
| Font | Cambria Math | Typst's bundled New Computer Modern Math | the system math font | — |
| Numbers | centered and right tab stops; the formula is set at inline size | ✓ | ✓ | written as `\tag{1}` |
| `align` | ✓ | ✓ | ✓ | ✗, GitHub centers it |

- docx: a numbered display formula is set at inline size, so fractions look a bit smaller.
- pdf: Chinese inside `\text{}` uses the body font. If Typst can't typeset a converted formula, all formulas in the document fall back to their LaTeX source and the document is laid out again, with a warning.
- html: stretchy brackets and large operators need a math font on the system. macOS has STIX Two Math and Windows has Cambria Math; on Linux without a math font they show at normal size.
- Markdown: a `|` inside a formula in a table cell isn't escaped and splits the cell. For absolute values use `\lvert x \rvert`.
- Structures docx and pdf can't handle (e.g. left sub/superscripts) fall back to plain text, with one warning.

## Complete example

```json title="math.json"
{
  "version": "0.1",
  "meta": { "title": "Math", "lang": "en" },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "intro", "quadratic", "integral", "cases", "table"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "Math examples" } },
    "intro": {
      "type": "Text",
      "props": { "text": ["An inline sum ", { "type": "InlineMath", "text": "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}" }, " puts its limits to the side; a display formula puts them above and below."] }
    },
    "quadratic": { "type": "Math", "props": { "latex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", "number": 1 } },
    "integral": { "type": "Math", "props": { "latex": "\\int_0^{\\infty} e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}", "number": "2" } },
    "cases": { "type": "Math", "props": { "latex": "|x| = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}" } },
    "table": {
      "type": "Table",
      "props": {
        "columns": ["Name", "Formula"],
        "rows": [
          ["Binomial coefficient", [{ "type": "InlineMath", "text": "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}" }]],
          ["Euler's identity", [{ "type": "InlineMath", "text": "e^{i\\pi} + 1 = 0" }]]
        ]
      }
    }
  }
}
```
