# 数据文件字段

每篇论文一个 CommonJS 文件：`module.exports = { ... }`。完整范例：`assets/examples/papers/nistor2025.js`（理论，带图）和 `wies2023.js`（实证，带图）。括号里是 `check_paper.js` 的字符上限。

## 通用字段

| 字段 | 说明 |
|---|---|
| `type` | `theory` / `empirical` / `qualitative` / `conceptual` |
| `typeLabel` | 可选，覆盖右上角标签，例如 "Qualitative study (interviews)" |
| `title` (130) | 论文全名；超过 50 个字符时自动改为两行小字号 |
| `authors` (90) | "First Last, First Last"；作者太多时写前三位加 "et al."，完整名单写进备注 |
| `year`, `journal`, `volume` | 期刊正式出版的年份；volume 如 "71(6), 5251–5267"，未分配时写 "" |
| `question` (150) | 研究问题 |
| `answerLead` (40) | 加粗的短答案 |
| `answer` (190) | 一两句展开 |
| `defs` | 恰好 2 个 `{ head (25), body (150) }`：关键概念卡片 |
| `resultLead` (125) | 加粗的主要结果 |
| `resultDetail` (175) | 条件或次要结果 |
| `why` | 2–4 条机制要点；有图时每条 110、合计 260，无图时每条 140、合计 420 |
| `whyNote` (90) | 可选，一行补充（关键数字、证据强度） |
| `implication` (220) | 一句话管理学启示 |
| `notes` | 字符串数组：引用与 DOI、出处、版本提醒、图表算法 |

## 理论文章

| 字段 | 说明 |
|---|---|
| `players` | 2–3 行 `[决策者 (22), 权衡 (75), 决策变量 (85)]` |
| `playerRowH` | 可选，每行高度（英寸），默认 2 行时 0.56、3 行时 0.46 |
| `timingNote` (80) | timing 标题后的一行，写目标函数，例如 "repeats continuously; the influencer maximizes total discounted profit" |
| `timing` | 3–5 步，每步 38 个字符；5 步时自动缩小字号 |

## 实证 / 质性 / 概念性论文

| 字段 | 说明 |
|---|---|
| `data` (175), `model` (175) | 数据与模型各一两句 |
| `dataBoxH` | 可选，数据框高度，默认 1.0 |
| `variables` | 3–5 行 `[角色 (12；质性/概念性 16), 变量 (26), 测量方式 (85)]` |
| `leftHeading`, `dataLabel`, `modelLabel`, `tableHeaders` | 质性/概念性论文用来改标签，例如 "Material and approach"、"Material"、"Approach"、["Concept", "Meaning", "Role in the argument"] |

## 图表（可选）

```js
chart: {
  type: "LINE",                  // 或 "BAR"
  title: "Followers over time (paper's example)",
  series: [{ name: "Optimal", labels: [/* ... */], values: [/* ... */] }],
  labelEvery: 10,                // 横轴每隔几个标签显示一个
  catTitle: "Follower count",    // 可选，横轴标题
  options: { valAxisHidden: true, showValue: true },  // 直接传给 pptxgenjs
}
```

- 数据必须来自论文印出的数字、系数或方程，算法写进备注。
- 柱状图标签默认按原精度显示（10.2 不会被显示成 10）。
- 单位没有意义时（例如标准化系数）隐藏纵轴数值，只看形状。
