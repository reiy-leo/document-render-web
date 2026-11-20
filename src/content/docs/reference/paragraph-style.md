---
title: 段落样式
description: document-render 段落字段一览：对齐、段前段后、行高、缩进、分页控制、中文排版开关，附各格式支持情况。
sidebar:
  order: 4
---

段落字段管一整段怎么排。「继承」一列是 ✓ 的会传给子元素。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

| 字段 | 值 | 例子 | 意思 | 继承 | docx | pdf | html |
|---|---|---|---|---|---|---|---|
| `align` | `left` `center` `right` `justify` `distribute` | `"justify"` | 对齐。`distribute` 是分散对齐 | ✓ | ✓ | ✓ `distribute` 按 `justify` 并警告 | ✓ |
| `spaceBefore` | 长度或 `"Nline"` | `12`、`"0.5line"` | 段前距 | | ✓ | ✓ | ✓ |
| `spaceAfter` | 同上 | `6` | 段后距 | | ✓ | ✓ | ✓ |
| `lineHeight` | 倍数、长度、`{ atLeast }` 或 `{ multiple }` | `1.5`、`"20pt"`、`{ "multiple": 1.5 }` | 行高，见[取值写法](/reference/units/#行高lineheight) | ✓ | ✓ | ✓ | ✓ |
| `marginLeft` | 长度 | `"2em"` | 整段左缩进 | | ✓ | ✓ | ✓ |
| `marginRight` | 长度 | `"2em"` | 整段右缩进 | | ✓ | ✓ | ✓ |
| `textIndent` | 长度 | `"2em"` | 首行缩进 | ✓ | ✓ | ✓ | ✓ |
| `hangingIndent` | 长度 | `"2em"` | 悬挂缩进：首行不动，其他行往里缩 | ✓ | ✓ | ✓ | ✓ |
| `keepWithNext` | 布尔 | `true` | 和下一段在同一页 | | ✓ | ✓ | ✓ |
| `keepTogether` | 布尔 | `true` | 这一段不拆到两页 | | ✓ | ✓ | ✓ |
| `pageBreakBefore` | 布尔 | `true` | 段前分页 | | ✓ | ✓ | ✓ |
| `widowControl` | 布尔 | `false` | 孤行控制 | ✓ | ✓ | ✓ | ✓ |
| `autoSpace` | 布尔 | `true` | 中英文、中文和数字之间自动加空隙 | ✓ | ✗ | ✓ | ✓ |
| `kinsoku` | 布尔 | `true` | 中文避头尾 | ✓ | ✗ | — 默认就有 | ✓ |
| `direction` | `ltr` `rtl` | `"rtl"` | 文字方向 | ✓ | ✓ | ✓ | ✓ |
| `wrap` | 布尔 | `false` | 自动换行。`false` 是不换行 | | ✗ | ✗ | ✓ |
| `outlineLevel` | 1–9 | `1` | 大纲级别，Word 导航窗格用 | | ✓ | — | — |
| `contextualSpacing` | 布尔 | `true` | 同样式段落之间不加段距 | ✓ | ✗ | ✗ | ✗ |

:::note
`contextualSpacing` 能写，三种格式都还没实现，渲染时会警告。
:::

## 缩进怎么配

- `textIndent` 和 `hangingIndent` 只写一个。都写时 `hangingIndent` 优先。
- 首行缩进两个字：`"textIndent": "2em"`。
- 编号、引文这种「第一行顶格，后面缩进」：`"hangingIndent": "2em"`。
- 整段往里缩：`"marginLeft": "2em"`。可以和上面两个一起用。
- 三种格式里 `hangingIndent` 都是首行不动、其他行往里缩。
- 缩进写成 `em` 时，docx 里同时写 Word 按字符计的缩进（leftChars、rightChars、firstLineChars、hangingChars），在 Word 里改字号，缩进跟着变。

## 段前段后距

- 段前段后距不继承，只管写了它的那一段。
- 内置默认：正文段后 6pt，标题段前 12pt（1 级 18pt）、段后 6pt。
- 节开头和手动分页后，Word 会保留段前距，pdf 也一样保留。

## 例子

```json
"styles": {
  "Text": { "textIndent": "2em", "align": "justify", "lineHeight": 1.6, "spaceAfter": "0.5line" },
  "quote": { "marginLeft": "2em", "marginRight": "2em", "textIndent": 0, "color": "#666666" },
  "Heading.1": { "align": "center", "pageBreakBefore": true }
}
```
