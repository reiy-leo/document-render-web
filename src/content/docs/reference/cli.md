---
title: 命令行
description: document-render 的命令和参数：render、check、catalog、parse，以及标准输入输出、自动读取的目录和调试变量。
sidebar:
  order: 1
---

```sh
document-render render <输入> -o <输出> [选项]
document-render check <输入> [选项]
document-render catalog [--json] [--catalog <路径>]...
document-render parse <docx> [-o <json>] [--assets <目录>]
document-render --version
document-render --help
```

## render

把 JSON 渲染成文件。

```sh
document-render render report.json -o report.docx
document-render render report.json -o report.html --paged
document-render render report.json -o report.md
document-render render report.json -o report.pdf --style-sets themes/ --style-set formal
```

| 参数 | 说明 |
|---|---|
| `<输入>` | JSON 文件。写 `-` 从标准输入读 |
| `-o, --output <文件>` | 输出文件，必填。按扩展名选格式：`.docx`、`.pdf`、`.html` 或 `.htm`、`.md`。写 `-` 输出到标准输出，这时要配 `--format` |
| `-f, --format <格式>` | 指定格式：`html`、`docx`、`pdf`、`md`，大小写都行。不写就看输出文件的扩展名 |
| `--paged` | 只对 html 有用：内嵌 Paged.js，打开就按页显示 |
| `--catalog <路径>` | 自定义组件的定义文件或目录，可以写多次 |
| `--style-sets <路径>` | 样式集文件或目录，可以写多次 |
| `--style-set <名字>` | 用哪个样式集，优先于文档里的 `styleSet` |

例子：从管道进、从管道出：

```sh
cat report.json | document-render render - -o - -f pdf > report.pdf
```

`.md` 出的是 GitHub 风格的 Markdown（GFM），只留结构，不留样式，见[各格式支持情况](/reference/format-support/#markdown)。

`xlsx`、`pptx` 要到第二版。现在写这两个扩展名会报错。

### --paged

html 默认是一长条网页，分页、页眉页脚、表头重复只在打印时出现。加 `--paged` 后：

- 按 `meta.page` 的纸张和页边距切页，`PageBreak` 后面从新页开始。
- 表格跨页时续页顶上重复表头（`repeatHeader: false` 时不重复）。
- 显示页眉页脚，填好页码。
- 排完版后 `<html>` 上会有 `data-document-render-ready="1"`。截图、打印的脚本可以等它。
- Paged.js（MIT，0.4.3）已经打包进二进制，离线能用。文件会大 500 KB 左右，打开时要等脚本排完。
- 屏幕上横竖混排没问题，打印时只用第一节的纸张。

## check

只校验，不出文件。参数和 `render` 的 `--catalog`、`--style-sets`、`--style-set` 一样。

```sh
document-render check report.json
# ok：展开后 12 个元素
```

「展开后」是指自定义组件展开成内置组件以后的元素数。LaTeX 写错、解析不了的公式会列成警告，不算校验失败。

## catalog

列出能用的组件。

```sh
document-render catalog
document-render catalog --json
document-render catalog --catalog my-components/
```

| 参数 | 说明 |
|---|---|
| `--json` | 输出每个组件 props 的 JSON Schema，还有 `description`、`container` |
| `--catalog <路径>` | 一起列出这些定义里的自定义组件，可以写多次 |

`catalog` 不读当前目录的 `catalog/`，要看自定义组件就用 `--catalog` 指定。

## parse

把 `.docx` 读成 document-render 的 JSON，图片导到 JSON 旁边的目录。能读哪些内容，见[从 Word 读回 JSON](/guide/parse/)。

```sh
document-render parse report.docx -o report.json                   # 图片导到 report.assets/
document-render parse report.docx > report.json                    # JSON 输出到标准输出
document-render parse report.docx -o out/report.json --assets img  # 图片导到 out/img/
```

| 参数 | 说明 |
|---|---|
| `<输入>` | docx 文件。写 `-` 从标准输入读 |
| `-o, --output <文件>` | 输出的 JSON 文件。不写或写 `-` 时输出到标准输出 |
| `--assets <目录>` | 图片导到哪个目录，相对 JSON 所在的目录。默认是「JSON 文件名.assets」，比如 `report.assets/` |

- JSON 里图片写相对路径，所以 JSON 和图片目录要放在一起，再 render 时才找得到。
- 输出到标准输出时，图片目录按当前目录算；文件名取输入的 docx，从标准输入读时叫 `document.assets/`。
- 文档里没有图片时不建目录。
- 认不出的内容在标准错误里给警告，以「警告：」开头，不会中断。

## mcp

:::caution[尚未实现]
`document-render mcp`（以 MCP server 方式运行）还没做，现在运行会报错。
:::

## 自动读取的目录

`render` 和 `check` 会自动读**文档所在目录**下的：

| 目录 | 里面放 |
|---|---|
| `catalog/` | 自定义组件定义，一个文件一个组件 |
| `styles/` | 样式集文件，每个文件要写 `name` |

只读 `.json` 文件，不进子目录。从标准输入读文档时，没有「文档所在目录」，不自动读。

图片的相对路径也按文档所在目录找。

## 输出和退出码

- 警告打到标准错误，以「警告：」开头。同一个格式不支持的同一个字段只报一次。
- 成功时打「已生成 文件名」，退出码 0。
- 出错时打出错原因（中文，带元素 id），退出码非 0，不生成文件。

## 调试

出 pdf 时设 `DOCUMENT_RENDER_DEBUG_TYPST=1`，会把生成的 Typst 源码打到标准错误：

```sh
DOCUMENT_RENDER_DEBUG_TYPST=1 document-render render report.json -o report.pdf 2> report.typ.txt
```
