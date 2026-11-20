---
title: 各格式支持情况
description: 同一份 JSON 在 docx、pdf、html、Markdown 里哪些地方不一样：组件、图片、公式、样式字段、分页和页眉页脚的支持对照表，以及下一版的改动。
sidebar:
  order: 10
---

同一份 JSON 在三种格式里尽量长得一样。Markdown 只留结构，单独见下面的「Markdown」一节。某个格式表达不了的样式，渲染时忽略，打一条警告（同一个字段只报一次），不报错。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

## 三种格式各自怎么出

| | docx | pdf | html |
|---|---|---|---|
| 怎么生成 | docx-rs | 先转成 Typst，再编译 | 自己拼 HTML，自带 CSS |
| 字体 | 只写名字，打开时用对方电脑的字体 | 渲染时从本机找字体，嵌进文件 | 交给浏览器 |
| 图片 | 打包进文件 | 打包进文件 | 本地图写成 `data:` URI |
| 分页 | ✓ | ✓ | 打印或 `--paged` 时 |
| 页眉页脚、页码 | Word 域，打开后自己算 | 排完版算好 | 只在 `--paged` 时 |

## 组件

| 组件 | docx | pdf | html |
|---|---|---|---|
| Heading | ✓ 另外挂 Word「标题 1–6」 | ✓ | ✓ |
| Text、Code、List | ✓ | ✓ | ✓ |
| Math、InlineMath | Word 公式（OMML），能直接改 | Typst 公式 | MathML，不用脚本 |
| Code 的 `lineNumbers` | ✓ | ✓ | ✓ |
| Table | ✓ 部位样式逐格写 | ✓ | ✓ |
| Image | 只收 png、jpeg、gif、webp | 不收网址 | ✓ |
| PageBreak | ✓ | ✓ | 打印或 `--paged` 时 |
| ColumnBreak | 分栏符；节没分栏时当分页 | `colbreak()`；节没分栏时当分页 | 分栏时 ✓；节没分栏时 — |
| Divider、Quote、Callout | ✓ 内边距和线宽算进缩进；`radius` ✗ | ✓ | ✓ |
| TableOfContents | Word TOC 域，更新域后才有页码 | ✓ 页码算好，可点 | 链接；`--paged` 时有页码 |
| Section | ✓ 每节末尾多一个空段落放节设置 | ✓ | `--paged` 时；打印只用第一节纸张 |
| Slide | 二级标题加正文，后面分页；部位 `body` ✗ | 一张一页 | 一张一页（16:9 框） |

## 图片

| | docx | pdf | html |
|---|---|---|---|
| png、jpeg、gif、webp | ✓ | ✓ | ✓ |
| svg | ✗，显示 alt | ✓ | ✓ |
| 网址 | ✗，显示 alt | ✗，显示 alt | ✓ |
| `float` 绕排 | ✓ | ✗，只左右对齐 | ✓ |
| `objectFit` | ✗ | ✓ | ✓ |
| `opacity` | ✗ | ✗ | ✓ |

## 文字字段

| 字段 | docx | pdf | html |
|---|---|---|---|
| `fontFamily` 回退列表 | 只取第一个名字 | ✓ | ✓ |
| `italic` | ✓ | 中文字体没有斜体 | ✓ |
| `underline` 双线、波浪 | ✓ | 画成单线，✗ | ✓ |
| `underlineColor` | ✗ | ✓ | ✓ |
| `strike: "double"` | ✓ | 画成单线，✗ | ✓ |
| `caps: "small"` | ✗ | ✓ | ✓ |
| `emphasisMark` | ✗ | ✗ | ✓ |
| `scale` | ✓ | ✗ | ✗ |
| `kerning` | ✗ | ✓ | ✓ |
| `lang` | — | ✓ | ✓ |
| 颜色透明度 | — | ✓ | ✓ |

## 段落字段

| 字段 | docx | pdf | html |
|---|---|---|---|
| `align: "distribute"` | ✓ | 按 `justify`，✗ | ✓ |
| `lineHeight` 各种写法 | ✓ Word 自己算 | ✓ 按 Word 的规则算 | ✓ 按 Word 的规则算，基线位置由浏览器定 |
| `autoSpace` | ✗ | ✓ | ✓ |
| `kinsoku` | ✗ | — 默认就有 | ✓ |
| `wrap: false` | ✗ | ✗ | ✓ |
| `outlineLevel` | ✓ | — | — |
| `contextualSpacing` | ✗ | ✗ | ✗ |
| `borderBetween` | ✓ | ✗ | ✗ |

## 盒子和背景

| 字段 | docx | pdf | html |
|---|---|---|---|
| 段落 `padding` | 只在有边框时生效（内置的 Code 样式也会因此警告） | ✓ | ✓ |
| `radius` | ✗ | ✓ | ✓ |
| `background` 底纹 | ✓ | 混成纯色 | 混成纯色 |
| `background` 渐变 | 取第一个颜色 | ✓ | ✓ |
| 边框 25 种线型 | ✓ | ✓ 几条线的拆成实线画，点划线、波浪线用图案 | ✓ CSS 没有的用 SVG 图案 |
| `background: "none"` | ✓ | ✓ | ✓ |
| `borderDiagonal` | 尚未实现 | 尚未实现 | 尚未实现 |
| `textRotation` | 只在表格格子里 | ✓ | ✓ |

## 列表、表格、页面

| 字段 | docx | pdf | html |
|---|---|---|---|
| `listMarkerImage` | ✗ | ✓ | ✓ |
| `listMarkerGap` 写长度 | 按 `tab`，✗ | ✓ | ✓ |
| `tableLayout` | ✓ | — | ✓ |
| `rowBreak: false` | ✓ | ✗ | ✓ |
| 固定行高 `exact` | ✓ | ✓ | 按最小高度 |
| 最小行高 | ✓ | 只对单行文字的格子 | ✓ |
| 表头重复 | ✓ | ✓ | 打印或 `--paged` 时 |
| `meta.title` / `author` / `lang` | — | ✓ | ✓ |

## pdf 的字体

- 默认中文字体按这个顺序找：苹方、冬青黑体、微软雅黑、Noto Sans CJK SC、思源黑体。微软雅黑排在前面，是因为 Windows 上没有苹方，Word 打开 docx 时会换成雅黑，这样 pdf 和 Windows Word 排出来一样。
- 都找不到时退回 Typst 自带字体，中文可能显示不全。
- 自己写的 `fontFamily` 排在默认列表前面。

## Markdown

`-o report.md` 或 `-f md` 出 Markdown，按 GitHub 的写法（GFM）。Markdown 没有样式，只留结构，适合贴进 README、喂给 AI 或做版本对比。

| 内容 | 写成 |
|---|---|
| Heading | `#` 到 `######` |
| Text | 段落；文字里的换行写成行尾反斜杠 |
| 粗体、斜体、删除线、上下标、链接、行内代码 | `**`、`*`、`~~`、`<sup>` `<sub>`、`[文字](网址)`、反引号；和段落本身相同的不标 |
| List | `1.`、`-`，子列表缩进对齐 |
| Table | 有表头、没有合并格时写成 GFM 表格；有合并格或没表头时写成内嵌 HTML 表格 |
| Code | 带语言名的围栏代码块；`lineNumbers` 忽略 |
| Quote | `>` |
| Callout | GitHub 提示框 `> [!NOTE]`；💡 写成 TIP，⚠️ 写成 WARNING，❗ 写成 IMPORTANT，⛔ 🚫 写成 CAUTION，认不出的图标留在文字前面 |
| Divider | `---` |
| Math、InlineMath | `$$…$$` 单独成块（编号写成 `\tag{1}`）、`$…$` |
| TableOfContents | 链到各标题的列表；被收进目录的标题前面加一个 `<a id>` 锚点 |
| Image | `![alt](src)`，路径原样写，不嵌图；`caption` 写成下一行斜体 |
| Section、Slide | 只留内容；Slide 的 `title` 写成二级标题 |

丢掉并警告：PageBreak、ColumnBreak、页眉页脚、页码域。不警告直接丢掉：字体、字号、颜色、间距、边框、对齐这类样式。

## 下一版

下面这条已经写进代码，还没发布（最新发布是 `v0.1.0-alpha.4`）：

- 上标下标：字号和抬高量取字体自带的上标下标值，跟 Word 一样；有中文时看东亚字体。`v0.1.0-alpha.4` 里 html 固定缩成 0.75 倍字号，pdf 用 Typst 的默认做法。
