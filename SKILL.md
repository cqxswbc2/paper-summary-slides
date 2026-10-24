---
name: paper-summary-slides
description: 把学术论文逐篇整理成"一页一篇"的阅读总结 PPT：研究问题与答案、两个关键概念、模型或数据与变量、主要结果与机制、一句话管理学启示。按论文类型（理论模型 / 实证 / 质性 / 概念性）使用不同的问题框架精读，内容写成每篇一个数据文件，由脚本生成 .pptx 并检查字数、版面与禁用写法。Use when the user asks to 做论文阅读总结PPT、一页PPT总结一篇论文、逐篇给导师汇报文献、把文献做成slide、summarize papers into slides, or wants to revise such slides after supervisor feedback. Do not use for searching or downloading papers (use literature-collection) or for writing a literature-review essay.
---

# 论文一页总结 PPT（paper-summary-slides）

把一篇论文压缩成导师能在一分钟内读懂的一页 PPT。页面结构、提问框架和写作准则都已固定在本 skill 里，换一个课题可以直接复用；新课题有特殊要求时，补进 `references/writing_rules.md` 末尾的"项目补充"。

## 0. 原则

- **以原文为准**：页面上每个数字、每个结论都要能在原文找到，出处（章节、表格、命题编号）写进该页备注。没找到的写"未披露"或不写，不推测。
- **写给导师看**：白话、具体、每句都有信息量；只写导师要求的内容，不加额外板块。
- **人做判断，skill 做整理**：哪篇论文相关、识别是否可信、结论能否推广，由用户和导师判断。skill 负责按固定框架提取、生成页面、检查格式，并标出没把握的地方。

## 1. 开工前确认

| 要确认的 | 默认值 |
|---|---|
| 导师的提问要求 | 研究问题及答案；理论文章问决策者、权衡、决策变量、博弈顺序、结果与机制；实证文章问数据、回归模型、因变量与自变量的测量、结论与机制；一句话管理学启示 |
| 页面语言 | 英文（术语与原文一致）；用户要求时改中文 |
| 范围 | 哪些论文、什么期刊档次（例如学校目录 A1 及以上），由用户或 literature-collection 的清单给出 |
| 交付 | 一个 .pptx，每篇一页，按主题分节；生成源文件（数据文件 + deck.json）随附，方便以后改 |
| 额外要求 | 导师或用户对格式有新要求时，先改写成规则补进 `references/writing_rules.md` 的"项目补充"，再动手 |

## 2. 判断论文类型，选择问题框架

读摘要和引言后先定类型，再按 `references/reading_questions.md` 中对应的问题清单精读：

| 类型 | 判断依据 | 左栏内容 |
|---|---|---|
| theory | 建立数学模型，结论以命题给出 | 决策者 × 权衡 × 决策变量表；博弈顺序 3–5 步 |
| empirical | 用数据做回归、实验或预测 | 数据与模型；变量表（角色、变量、测量方式） |
| qualitative | 访谈、民族志、编码分析 | 材料与方法；关键概念表 |
| conceptual | 框架或综述，无新数据 | 材料与思路；关键概念表 |

多研究论文（田野数据 + 实验）按主研究填写，其他研究在数据栏一句带过。

## 3. 精读并写数据文件

1. 提取全文文本（`pypdf`），按"摘要 → 引言 → 模型或数据 → 主要结果 → 结论"的顺序读，不只读摘要。
2. 按问题框架回答，再压缩成页面字段，每篇写一个 `papers/<id>.js`。字段和字数上限见 `references/field_spec.md`，写法见 `references/writing_rules.md`，完整范例见 `assets/examples/papers/`。
3. 图表可选：只在能用论文里印出的数字或方程如实重画时才加（例如按命题方程重画数值例子、按回归系数画倒 U 形）。备注里写清计算方法；不能如实重画就不加。
4. 备注（`notes`）必须写：完整引用与 DOI；每个关键数字的出处；工作论文版或作者版的提醒；作者自己的推测与已检验结论的区别。

## 4. 检查

```bash
node scripts/check_paper.js papers/*.js
```

检查内容：必填字段、字数上限、按版面估算的行数（问题与答案、概念卡、变量表高度、机制栏）、禁用写法（she/he、页面上的希腊字母参数、"no empirical data"之类的空话）。不通过就改到通过。

## 5. 生成与看图

```bash
node scripts/build_deck.js deck.json output.pptx
# Windows + PowerPoint：导出每页图片
powershell -ExecutionPolicy Bypass -File scripts/export_png.ps1 -Deck <绝对路径.pptx> -OutDir <图片目录>
# 没有 PowerPoint：soffice --headless --convert-to pdf output.pptx，再用 pdftoppm 转图片
```

检查脚本只能估算。**每一页都要看导出的图片**，按 `references/qa_checklist.md` 逐项核对：有没有溢出、遮挡、截断，图表数字是否按原精度显示，内容是否前后一致。PowerPoint 的渲染最准；LibreOffice 的字体替换可能和实际效果有出入。

## 6. 多篇论文：批量流程

先做 1–2 页样板交给导师确认格式，再批量做。批量时按 `references/batch_workflow.md`：

1. 统一字段与规范（本 skill 的 field_spec、writing_rules、两页范例）。
2. 分组并行精读，每组不超过 4 篇；每个执行者只写自己那几篇的数据文件，不改模板和他人文件。
3. 汇总后由一人统一检查：脚本检查 → 生成 → 逐页看图 → 抽查数字回原文。
4. 共性问题改模板或检查脚本，个别问题改数据文件。

## 7. 吸收新的修改意见

1. 把意见改写成可执行的规则（"不要怎样"改成"应该怎样"，并给出写法示例），补进 `references/writing_rules.md`；能自动检查的，加进 `scripts/check_paper.js`（现有的例子：禁用 she/he、页面不出现参数符号）。
2. 重做受影响的页面：个别问题只改数据文件；涉及整体格式时改 `scripts/slide_lib.js`，所有页面一起更新。
3. 交回前确认修改没有引入新的溢出。

## 8. 交付时向用户汇报

- 做了哪些页，按什么主题分节。
- 哪些页依据工作论文版或作者版，引用时要换成正式版。
- 哪些数字没有回到原文逐一核对（建议用户抽查的页面）。
- 缺全文、没做的论文。
- 本轮新增的规则（已写入 references 和检查脚本）。
