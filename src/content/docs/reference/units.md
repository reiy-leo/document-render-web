---
title: 取值写法
description: document-render 样式里长度、颜色、字体、行高、边框、背景、列宽和纸张名的写法。
sidebar:
  order: 2
---

样式字段的值有几种固定的写法。写错了 `check` 会报错，并告诉你怎么写。

## 长度

**数字就是 pt。** 字符串可以带单位：

| 单位 | 例子 | 换算 | 用在哪 |
|---|---|---|---|
| 不带单位 | `12`、`"12"` | pt | 任何长度 |
| `pt` | `"10.5pt"` | 1pt = 1/72 in | 任何长度 |
| `mm` | `"20mm"` | | 任何长度 |
| `cm` | `"2.5cm"` | | 任何长度 |
| `in` | `"1in"` | 1in = 72pt | 任何长度 |
| `px` | `"16px"` | 1px = 0.75pt（96 dpi） | 任何长度 |
| `em` | `"2em"` | 当前字号的倍数 | 缩进、字间距、内边距等 |
| `line` | `"0.5line"` | 行数 | `spaceBefore`、`spaceAfter` |
| `%` | `"50%"` | 百分比 | 宽高 |

- `"2em"` 用在 `textIndent` 上就是首行缩进两个字。`marginLeft`、`marginRight`、`textIndent`、`hangingIndent` 写成 `em` 时，docx 里同时写 Word 按字符计的缩进（leftChars、rightChars、firstLineChars、hangingChars），在 Word 里改字号缩进跟着变；pdf、html 按字号算。
- `"0.5line"` 在 docx 里写成 Word 的「行」单位；pdf、html 按字号 × 1.2 × 行数算。
- `px` 是 CSS 的参考像素，不是屏幕的物理像素。CSS 定死了 1in = 96px = 72pt，所以换算和屏幕无关。Retina 屏只是用 2 个物理像素画 1px，打印出来的尺寸不变。
- 页面设置（纸张、页边距）、表格列宽、行高只认绝对长度（pt mm cm in px）。
- 可以写负数，比如 `"-2pt"`。

## 颜色

只认十六进制：

| 写法 | 例子 |
|---|---|
| `#RGB` | `"#c00"` |
| `#RRGGBB` | `"#1A73E8"` |
| `#RGBA` | `"#c008"` |
| `#RRGGBBAA` | `"#1A73E880"` |

- 大小写都行。
- 不认颜色名：`"red"` 会报错。
- 透明度（后两位）：html、pdf 支持，docx 忽略。
- 没有主题色。

## 字体：fontFamily

```json
"fontFamily": "Inter"
"fontFamily": { "latin": "Inter", "eastAsia": "思源黑体", "complex": "Noto Naskh Arabic" }
"fontFamily": { "latin": "Liberation Serif, Times New Roman", "eastAsia": "Noto Serif CJK SC, Songti SC, SimSun" }
```

| 键 | 管哪些字 |
|---|---|
| `latin` | 西文 |
| `eastAsia` | 中日韩 |
| `complex` | 阿拉伯文等复杂文种 |

- 写成字符串时三项都用它。
- 每项可以写逗号分隔的回退列表。html、pdf 按顺序找；docx 只取第一个名字。
- 后叠的样式只改它写了的文种，没写的保留。

## 行高：lineHeight

| 写法 | 例子 | 意思 |
|---|---|---|
| 数字 | `1.5` | 倍数：字号 × 1.5 |
| `em` 或 `%` | `"1.5em"`、`"150%"` | 同样是倍数 |
| 其他长度 | `"20pt"` | 固定值 |
| `{ "atLeast": 长度 }` | `{ "atLeast": "18pt" }` | 最小值，字大了会撑高 |
| `{ "multiple": 倍数 }` | `{ "multiple": 1.5 }` | Word 的「多倍行距」：字体自己的单倍行高 × 1.5 |

:::caution
`lineHeight` 写数字是**倍数**，不是 pt。要固定 20pt，写 `"20pt"`。
:::

数字和 `{ multiple }` 都叫倍数，乘的东西不一样：

- 数字 `1.5`：至少字号 × 1.5，字比它高时撑开。docx 里写成「最小值 = 字号 × 1.5」。想让三种格式行高一致，默认用这个。
- `{ "multiple": 1.5 }`：跟 Word 的多倍行距一样，乘的是字体自己的单倍行高。中文字体的单倍行高大约是字号的 1.3 倍，微软雅黑更高，约 1.7 倍。要和 Word 做的文档对上时用它，`document-render parse` 读出来的也是这种。

### 行高怎么算

pdf 和 html 的行高照 Windows 版 Word 排 docx 的规则算（在 Word 2024 上实测过），三种格式出来一样高：

- 一种字体的单倍行高要看字体文件。西文字体比如 Calibri 1.221、Arial 1.150；中日韩字体在字体全高的上下各加 0.15 倍，比如宋体 1.297、等线 1.354、微软雅黑 1.715。
- 一行里有几种字体（中文配西文）时，上沿取最高的，下沿取最深的。
- 多倍行距多出来的高度加在基线下面；数字和最小值多出来的加在基线上面；固定值的基线在行高的 0.8 处，跟字体无关。
- 表格横线的粗细也算进行高，跟 Word 一样。
- 字体按「列表里第一个本机找得到的」算。本机没有、看文档那台电脑有的字体，行高会有出入。
- html 只能定行高，基线在行里的位置还是浏览器自己分。浏览器用的字体和生成时找到的不一样时，行高也会有出入。

## 边框

一条边可以写成字符串，也可以写成对象：

```json
"border": "1pt solid #CCCCCC"
"borderBottom": { "width": 2, "style": "double", "color": "#1A73E8" }
"borderInsideV": "none"
```

- 字符串里三样顺序随意，都能省：线宽默认 1pt，线型默认 `solid`，颜色默认黑色。
- `"none"` 表示没有线。

### 线型

支持 Word 的全部 25 种线型（艺术边框除外）。名字照抄 Word，只有三个不一样：`solid` 是 Word 的 single，`dashDot` 是 dotDash，`dashDotDot` 是 dotDotDash。

| 值 | 样子 |
|---|---|
| `none` | 没有线 |
| `solid` | 实线 |
| `thick` | 粗实线 |
| `dashed` | 虚线 |
| `dashSmallGap` | 空隙很小的虚线 |
| `dotted` | 点线 |
| `dashDot` | 一划一点 |
| `dashDotDot` | 一划两点 |
| `dashDotStroked` | 斜着的一划一点 |
| `double` | 双线 |
| `triple` | 三条细线 |
| `thinThickSmallGap` `thinThickMediumGap` `thinThickLargeGap` | 一细一粗两条，空隙小、中、大 |
| `thickThinSmallGap` `thickThinMediumGap` `thickThinLargeGap` | 一粗一细两条，空隙小、中、大 |
| `thinThickThinSmallGap` `thinThickThinMediumGap` `thinThickThinLargeGap` | 细粗细三条，空隙小、中、大 |
| `wave` | 波浪线 |
| `doubleWave` | 两条波浪线 |
| `threeDEmboss` / `threeDEngrave` | 凸起、凹下去的立体线 |
| `outset` / `inset` | 整个框凸出来、凹进去 |

几条线的线型，线宽按比例分给每条线和中间的空：`double`、`triple` 的线和空一样宽；细粗这几种是细线、空、粗线 1:1:3，中空隙的空是 2，大空隙是 4。比如 `3pt thinThickSmallGap`：细线 0.6pt，空 0.6pt，粗线 1.8pt。

各格式怎么画：

- docx：直接写 Word 的线型，Word 自己画。
- html：CSS 有的（solid、dashed、dotted、double、ridge、groove、inset、outset）直接用；CSS 没有的，用 SVG 图案盖在一条透明边上。
- pdf：实线、虚线、点线用 Typst 自带的线。几条线的线型拆成几条实线画，线都是整条的；点划线、波浪线这些用跟 html 同一份 SVG 图案。
- Markdown：没有边框。

Word 的线宽只能在 0.25pt 到 12pt 之间，超出时取最近的值。

## 背景：background

三种写法，外加 `"none"`：

```json
"background": "#F5F7FA"
"background": { "pattern": "pct20", "color": "#000000", "fill": "#FFFFFF" }
"background": { "gradient": "linear", "angle": 90, "stops": ["#FFFFFF", "#E8F0FE"] }
```

| 写法 | 字段 | docx | pdf | html |
|---|---|---|---|---|
| 纯色 | 颜色 | ✓ | ✓ | ✓ |
| 底纹 | `pattern` 底纹名，`color` 前景色（默认黑），`fill` 底色（默认白） | ✓ | 混成纯色 | 混成纯色 |
| 渐变 | `gradient` 只能是 `"linear"`，`angle` 角度（默认 90），`stops` 至少两个颜色 | 取第一个颜色 | ✓ | ✓ |

`"background": "none"` 表示不画底色，用来去掉继承来的或内置的底色，比如表头默认的灰底。

底纹名：`pct5` `pct10` `pct20` `pct25` `pct30` `pct40` `pct50` `pct60` `pct70` `pct75` `pct80` `pct90` `horzStripe` `vertStripe` `diagStripe` `reverseDiagStripe` `horzCross` `diagCross` `thinHorzStripe` `thinVertStripe` `thinDiagStripe` `thinReverseDiagStripe` `thinHorzCross` `thinDiagCross`。

## 表格列宽：widths

| 写法 | 例子 | 意思 |
|---|---|---|
| 大于 0 的数字 | `3` | 比例，分剩下的宽度 |
| 绝对长度 | `"20mm"` | 固定宽度 |
| `"auto"` | `"auto"` | 按内容撑开 |

详见[表格](/guide/tables/)。

## 表格行高：rowHeights

| 写法 | 例子 | 意思 |
|---|---|---|
| 绝对长度 | `"28pt"`、`20` | 最小高度 |
| 对象 | `{ "height": "20pt", "rule": "exact" }` | `rule` 是 `atLeast`（默认）或 `exact` |
| `null` | | 不管 |

## 纸张名

`A3` `A4` `A5` `B5` `Letter` `Legal`，大小写都行。也可以写 `{ "width": "180mm", "height": "260mm" }`。不认识的名字按 A4 处理，并给警告。

## 布尔和枚举

- 布尔写 `true` / `false`，不能写字符串 `"true"`。
- 枚举值区分大小写：`"topAndBottom"` 对，`"topandbottom"` 错。
