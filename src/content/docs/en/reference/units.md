---
title: Values
description: How to write lengths, colors, fonts, line heights, borders, backgrounds, column widths and paper names in document-render styles.
sidebar:
  order: 2
---

Style values come in a few fixed shapes. Get one wrong and `check` reports it and tells you the expected form.

## Lengths

**A number is pt.** Strings may carry a unit:

| Unit | Example | Conversion | Where |
|---|---|---|---|
| none | `12`, `"12"` | pt | any length |
| `pt` | `"10.5pt"` | 1pt = 1/72 in | any length |
| `mm` | `"20mm"` | | any length |
| `cm` | `"2.5cm"` | | any length |
| `in` | `"1in"` | 1in = 72pt | any length |
| `px` | `"16px"` | 1px = 0.75pt (96 dpi) | any length |
| `em` | `"2em"` | multiple of the current font size | indents, letter spacing, padding, … |
| `line` | `"0.5line"` | number of lines | `spaceBefore`, `spaceAfter` |
| `%` | `"50%"` | percentage | widths and heights |

- `"2em"` on `textIndent` is a two-character first-line indent. When `marginLeft`, `marginRight`, `textIndent` or `hangingIndent` is in `em`, docx also writes Word's character units (leftChars, rightChars, firstLineChars, hangingChars), so the indent follows font size changes in Word; pdf and html compute it from the font size.
- `"0.5line"` becomes Word's line unit in docx; pdf and html compute font size × 1.2 × lines.
- `px` is the CSS reference pixel, not a physical screen pixel. CSS fixes 1in = 96px = 72pt, so the conversion does not depend on the screen. A Retina display just draws 1px with 2 device pixels; the printed size stays the same.
- Page settings (paper, margins), table column widths and row heights take absolute lengths only (pt mm cm in px).
- Negative values are fine, e.g. `"-2pt"`.

## Colors

Hex only:

| Form | Example |
|---|---|
| `#RGB` | `"#c00"` |
| `#RRGGBB` | `"#1A73E8"` |
| `#RGBA` | `"#c008"` |
| `#RRGGBBAA` | `"#1A73E880"` |

- Case doesn't matter.
- No color names: `"red"` is an error.
- Alpha (the last two digits): supported by html and pdf, ignored by docx.
- No theme colors.

## Fonts: fontFamily

```json
"fontFamily": "Inter"
"fontFamily": { "latin": "Inter", "eastAsia": "Source Han Sans SC", "complex": "Noto Naskh Arabic" }
"fontFamily": { "latin": "Liberation Serif, Times New Roman", "eastAsia": "Noto Serif CJK SC, Songti SC, SimSun" }
```

| Key | Script |
|---|---|
| `latin` | Latin |
| `eastAsia` | Chinese, Japanese, Korean |
| `complex` | Arabic and other complex scripts |

- A plain string sets all three.
- Each entry may be a comma-separated fallback list. html and pdf try them in order; docx uses only the first name.
- A later style only changes the scripts it names; the rest are kept.

## Line height: lineHeight

| Form | Example | Meaning |
|---|---|---|
| number | `1.5` | Multiple: font size × 1.5 |
| `em` or `%` | `"1.5em"`, `"150%"` | Also a multiple |
| other length | `"20pt"` | Exact |
| `{ "atLeast": length }` | `{ "atLeast": "18pt" }` | Minimum; grows for larger text |
| `{ "multiple": factor }` | `{ "multiple": 1.5 }` | Word's "Multiple" spacing: the font's own single line height × 1.5 |

:::caution
A number in `lineHeight` is a **multiple**, not pt. For exactly 20pt, write `"20pt"`.
:::

A number and `{ multiple }` are both multiples, but of different things:

- Number `1.5`: at least font size × 1.5, growing if the text is taller. docx writes it as "at least font size × 1.5". Use this by default when you want the same line height in all three formats.
- `{ "multiple": 1.5 }`: same as Word's Multiple spacing, multiplying the font's own single line height. A Chinese font's single line height is about 1.3 × the font size; Microsoft YaHei is taller, about 1.7×. Use it to match documents made in Word; it's also what `document-render parse` produces.

### How line height is computed

pdf and html compute line height with the rules Windows Word uses for docx (measured on Word 2024), so all three formats come out the same height:

- A font's single line height comes from the font file. Latin fonts: e.g. Calibri 1.221, Arial 1.150. CJK fonts add 0.15 of the font's full height above and below, e.g. SimSun 1.297, DengXian 1.354, Microsoft YaHei 1.715.
- When a line mixes fonts (Chinese with Latin), the top is the tallest ascent and the bottom the deepest descent.
- Extra height from Multiple spacing goes below the baseline; extra height from a number or a minimum goes above it; with an exact value the baseline sits at 0.8 of the line height, regardless of font.
- Table border widths count toward row height, as in Word.
- The first font in the list that is installed locally is used. If the machine viewing the document has a font this one lacks, heights can differ.
- html can only set the line height; where the baseline sits inside the line is up to the browser. If the browser uses a different font from the one found at render time, heights can differ too.

## Borders

One side, as a string or an object:

```json
"border": "1pt solid #CCCCCC"
"borderBottom": { "width": 2, "style": "double", "color": "#1A73E8" }
"borderInsideV": "none"
```

- In the string, the three parts can come in any order and all are optional: width defaults to 1pt, style to `solid`, color to black.
- `"none"` means no line.

### Line styles

All 25 of Word's line styles are supported (art borders excluded). Names follow Word, except three: `solid` is Word's single, `dashDot` is dotDash, `dashDotDot` is dotDotDash.

| Value | Looks like |
|---|---|
| `none` | no line |
| `solid` | solid line |
| `thick` | thick solid line |
| `dashed` | dashes |
| `dashSmallGap` | dashes with small gaps |
| `dotted` | dots |
| `dashDot` | dash, dot |
| `dashDotDot` | dash, dot, dot |
| `dashDotStroked` | slanted dash-dot |
| `double` | two lines |
| `triple` | three thin lines |
| `thinThickSmallGap` `thinThickMediumGap` `thinThickLargeGap` | thin and thick, small, medium or large gap |
| `thickThinSmallGap` `thickThinMediumGap` `thickThinLargeGap` | thick and thin, small, medium or large gap |
| `thinThickThinSmallGap` `thinThickThinMediumGap` `thinThickThinLargeGap` | thin, thick, thin; small, medium or large gap |
| `wave` | wavy line |
| `doubleWave` | two wavy lines |
| `threeDEmboss` / `threeDEngrave` | raised / sunken 3D line |
| `outset` / `inset` | whole box raised / sunken |

For multi-line styles the width is split among the lines and gaps: `double` and `triple` use equal lines and gaps; the thin-thick styles use 1:1:3 (thin line, gap, thick line), with a gap of 2 for medium and 4 for large. For example `3pt thinThickSmallGap`: thin 0.6pt, gap 0.6pt, thick 1.8pt.

How each format draws them:

- docx: writes Word's line style; Word draws it.
- html: styles CSS has (solid, dashed, dotted, double, ridge, groove, inset, outset) are used directly; others get an SVG pattern over a transparent border.
- pdf: solid, dashed and dotted use Typst's own strokes. Multi-line styles are drawn as separate solid lines, so lines stay continuous; dash-dot, wave and similar use the same SVG pattern as html.
- Markdown: no borders.

Word only allows border widths from 0.25pt to 12pt; values outside are clamped.

## Background: background

Three forms, plus `"none"`:

```json
"background": "#F5F7FA"
"background": { "pattern": "pct20", "color": "#000000", "fill": "#FFFFFF" }
"background": { "gradient": "linear", "angle": 90, "stops": ["#FFFFFF", "#E8F0FE"] }
```

| Form | Fields | docx | pdf | html |
|---|---|---|---|---|
| solid | a color | ✓ | ✓ | ✓ |
| pattern | `pattern` name, `color` foreground (default black), `fill` background (default white) | ✓ | blended to a solid color | blended to a solid color |
| gradient | `gradient` must be `"linear"`, `angle` in degrees (default 90), `stops` with at least two colors | first color only | ✓ | ✓ |

`"background": "none"` means no background. Use it to remove an inherited or built-in background, such as the default gray header.

Pattern names: `pct5` `pct10` `pct20` `pct25` `pct30` `pct40` `pct50` `pct60` `pct70` `pct75` `pct80` `pct90` `horzStripe` `vertStripe` `diagStripe` `reverseDiagStripe` `horzCross` `diagCross` `thinHorzStripe` `thinVertStripe` `thinDiagStripe` `thinReverseDiagStripe` `thinHorzCross` `thinDiagCross`.

## Table column widths: widths

| Form | Example | Meaning |
|---|---|---|
| number > 0 | `3` | Ratio of the remaining width |
| absolute length | `"20mm"` | Fixed width |
| `"auto"` | `"auto"` | Fit the content |

See [Tables](/en/guide/tables/).

## Table row heights: rowHeights

| Form | Example | Meaning |
|---|---|---|
| absolute length | `"28pt"`, `20` | Minimum height |
| object | `{ "height": "20pt", "rule": "exact" }` | `rule` is `atLeast` (default) or `exact` |
| `null` | | No height |

## Paper names

`A3` `A4` `A5` `B5` `Letter` `Legal`, case-insensitive. Or `{ "width": "180mm", "height": "260mm" }`. Unknown names fall back to A4 with a warning.

## Booleans and enums

- Booleans are `true` / `false`, not the string `"true"`.
- Enum values are case-sensitive: `"topAndBottom"` works, `"topandbottom"` doesn't.
