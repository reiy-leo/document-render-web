---
title: 公式
description: 用 LaTeX 写公式：行内公式 InlineMath 写在 runs 里，块级公式用 Math 组件；docx 出 Word 公式，pdf 用 Typst 排，html 用 MathML，Markdown 写 $…$。
sidebar:
  order: 9
---

公式写 LaTeX，分两种：

- **InlineMath**：行内公式，写在 runs 里，跟文字排在一行。
- **Math**：块级公式，单独占一行，默认居中，可以带编号。

```json
"intro": {
  "type": "Text",
  "props": { "text": ["勾股定理 ", { "type": "InlineMath", "text": "a^2+b^2=c^2" }, "。"] }
},
"quadratic": {
  "type": "Math",
  "props": { "latex": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", "number": 1 }
}
```

:::caution[反斜杠写两个]
JSON 字符串里 `\` 要写成 `\\`：`"\\frac"` 才是 LaTeX 的 `\frac`。
:::

## InlineMath

在 run 里写 `"type": "InlineMath"`，`text` 是 LaTeX 源码，不用写 `$`。Text、Heading、List 项、表格格子里都能用。

```json
"text": ["圆面积 ", { "type": "InlineMath", "text": "S=\\pi r^2" }, "，根号 ", { "type": "InlineMath", "text": "\\sqrt{2}\\approx 1.414" }, "。"]
```

- 跟着所在段落的文字样式走（字号、颜色、粗体）。要单独改，写组件样式 `InlineMath`。
- 行内公式不能带链接，写了 `href` 也不加。

## Math

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `latex` | 字符串 | 是 | LaTeX 源码，不用写 `$$` |
| `number` | 整数或字符串 | 否 | 编号，写 `1` 就在右边显示「(1)」 |

```json
"e": { "type": "Math", "props": { "latex": "E = mc^2" }, "style": { "fontSize": 16, "color": "#1A73E8", "align": "left" } }
```

- 默认样式：居中、段前 6pt、段后 6pt。`fontSize`、`color`、`align` 都能改。

## 能写哪些 LaTeX

能用的写法以 [math-core](https://github.com/tmke8/math-core) 为准，常用的都行：

- 上下标、`\frac`、`\sqrt`、`\sqrt[3]{}`、`\binom`
- `\sum`、`\prod`、`\int` 带上下限，`\lim`
- 希腊字母、`\mathbf`、`\mathbb`、`\text`
- `\left( \right)` 这类能拉伸的括号
- `pmatrix`、`bmatrix` 这类矩阵，`cases`
- `\hat`、`\vec`、`\bar` 这类重音，`\overline`、`\underbrace`

LaTeX 写错了，整个文件照样能出来：这个公式改成显示 LaTeX 原文，并给一条警告。`document-render check` 也会把解析不了的公式列成警告，渲染前就能发现。

## 各格式怎么出

| | docx | pdf | html | Markdown |
|---|---|---|---|---|
| 写成 | Word 公式（OMML），在 Word 里双击能改 | Typst 公式 | MathML，不用脚本，离线能看 | `$…$`、`$$…$$`，GitHub 能显示 |
| 字体 | Cambria Math | Typst 自带的 New Computer Modern Math | 系统的公式字体 | — |
| 编号 | 居中、右对齐两个制表位，公式按行内大小排 | ✓ | ✓ | 写成 `\tag{1}` |
| `align` | ✓ | ✓ | ✓ | ✗，按 GitHub 默认居中 |

- docx：带编号的块级公式按行内大小排，分数会小一点。
- pdf：`\text{}` 里的中文用正文字体。万一 Typst 排不了转出来的公式，整份文档的公式改成显示 LaTeX 原文再排一次，并给警告。
- html：括号拉伸、大号求和符号要靠系统里的公式字体。macOS 有 STIX Two Math，Windows 有 Cambria Math；Linux 没装公式字体时会显示成普通大小。
- Markdown：表格格子里公式中的 `|` 不转义，会把格子拆开。写绝对值用 `\lvert x \rvert`。
- docx 和 pdf 认不出的结构（比如左上下标）退成纯文字，并给一次警告。

## 完整例子

```json title="math.json"
{
  "version": "0.1",
  "meta": { "title": "公式", "lang": "zh-CN" },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "intro", "quadratic", "integral", "cases", "table"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "公式示例" } },
    "intro": {
      "type": "Text",
      "props": { "text": ["行内的求和 ", { "type": "InlineMath", "text": "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}" }, " 上下限放在右边，块级公式里放在正上正下。"] }
    },
    "quadratic": { "type": "Math", "props": { "latex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", "number": 1 } },
    "integral": { "type": "Math", "props": { "latex": "\\int_0^{\\infty} e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}", "number": "2" } },
    "cases": { "type": "Math", "props": { "latex": "|x| = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}" } },
    "table": {
      "type": "Table",
      "props": {
        "columns": ["名称", "公式"],
        "rows": [
          ["二项式系数", [{ "type": "InlineMath", "text": "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}" }]],
          ["欧拉公式", [{ "type": "InlineMath", "text": "e^{i\\pi} + 1 = 0" }]]
        ]
      }
    }
  }
}
```
