---
title: 从 Word 读回 JSON
description: document-render parse 把 .docx 读成 document-render 的 JSON，图片导到旁边的目录；能读哪些内容，样式怎么归并，哪些还不支持。
sidebar:
  order: 10
---

`document-render parse` 反过来用：把一份 `.docx` 读成 document-render 的 JSON。读出来的格式和 `render` 的输入一样（平铺的 `elements` 加 `root`），改完内容、换个样式集，能直接再 render 成 docx、pdf、html。

```sh
document-render parse report.docx -o report.json                   # 图片导到 report.assets/
document-render parse report.docx > report.json                    # 不写 -o 时输出到标准输出，图片导到当前目录的 report.assets/
document-render parse report.docx -o out/report.json --assets img  # 图片导到 out/img/
```

参数见[命令行](/reference/cli/#parse)。

目标是 parse 完再 render 回 docx，看起来基本一样。认不出、表达不了的内容在标准错误里给警告，不会中断。只读 docx，pdf 不能读回 JSON。

## 能读的内容

| 内容 | 读成什么 |
|---|---|
| 标题 | 段落样式是「标题 1」到「标题 6」（或样式里写了大纲级别）的段落，读成 Heading |
| 正文和行内样式 | 字体、字号、颜色、粗体、斜体、下划线、删除线、上下标、大小写、字间距、缩放、高亮、底纹、着重号、隐藏；链接（超链接和 HYPERLINK 域）；字符样式叫 InlineCode 的读成行内代码 |
| 段落格式 | 对齐、段前段后、行距、缩进、与下段同页、段中不分页、段前分页、孤行控制、边框和底纹 |
| 列表 | numbering.xml 里的编号读成 List：有序无序、嵌套、每一级的编号类型、编号模板、起始编号、缩进、编号颜色和字号 |
| 表格 | 合并格（gridSpan、vMerge）、列宽、行高、每格的底纹、边框、对齐、竖排、边距 |
| 图片 | 行内图片和单独一段的图片，导出成文件，JSON 里写相对路径；浮动图片按位置写成 `float` 或 `absolute` |
| 分节 | 纸张大小和方向、页边距、页眉页脚距离、分栏、首页不同、奇偶页不同、页码起始值、页码格式 |
| 页眉页脚 | 读成元素，页眉页脚的 id 是 `header1`、`footer1` 这样 |
| 域和分隔符 | 页码（PAGE、NUMPAGES、SECTIONPAGES 域）、分页符、分栏符（读成 ColumnBreak）、目录（TOC 域读成 TableOfContents） |
| 边框 | Word 的 25 种线型都换回 document-render 的名字，`single` 写成 `solid` |
| 公式 | OMML 转成 LaTeX：单独一段的读成 Math（带编号的也认），夹在文字里的读成 InlineMath |

几处细节：

- **行距**：Word 的「多倍行距」读成 `{ "multiple": 倍数 }`，乘的是字体自己的单倍行高，跟 Word 一样。见[取值写法](/reference/units/)。
- **缩进**：按字符计的缩进写成 `em`。
- **表头**：按 Word 的「重复标题行」（`w:tblHeader`）认。第一行设了它就读成表头 `columns`；原来没底纹的，写上 `parts.header` 的 `"background": "none"`，有底纹的照写。没设的第一行当普通行。好几行都设了时只有第一行当表头，并给警告。
- **替代文字**：从图片的 descr 读，没有 descr 时用 title。Image 写成 `alt`，行内图片写成 `text`。
- **页码格式**：认 `decimal`、`lowerRoman`、`upperRoman`、`lowerLetter`、`upperLetter`、`chineseCounting` 六种，别的格式给警告，按阿拉伯数字处理。
- **分节**：第一节写进 `meta.page`，后面每节一个 Section，只写和上一节不同的纸张设置。
- **公式**：认不出的结构给警告，只留文字。

## 样式怎么归并

parse 不会让每一段都带一大串样式：

1. 先按 Word 的规则算出每段、每个 run 实际用的格式。
2. 只写和「不写时会是什么」不一样的字段。
3. 大多数正文段落共用的字体、字号、行距写进 `styles` 的 `Document`；正文的段前段后、首行缩进写进 `Text`；各级标题写进 `Heading.1` 这些键。
4. 其他用到的 Word 段落样式和字符样式，写成同名的命名样式，元素用 `style` 引用。名字和组件名重名时，前面加 `Word `。
5. 字体一律写英文族名：宋体写成 SimSun，微软雅黑写成 Microsoft YaHei，主题字体换成主题里的实际字体。

## 还不支持

下面这些读不出来，会给警告：

- 文本框、形状、艺术字、图表、SmartArt。嵌入对象（比如 MathType 公式）只留预览图。
- 脚注、尾注、批注、修订。修订里删掉的文字不要，插入的文字照常保留。
- 制表位（制表符原样留在文字里）、页面垂直对齐、连续分节。
- 表格样式里的条件格式（首行、隔行这些）、表格整体居中、格子斜线。表格里套的表格，文字接在格子里。
- 文档网格的行网格对齐：Word 文档的 `docGrid` 是 lines 时，Word 会把行高凑成网格的整数倍，parse 不做，给警告。
- 渲染器本来就表达不了的东西，读回来也一样。比如同一级列表在 Word 里只有一种编号定义。
