# 写作准则

每一页都按这些准则写。能自动检查的已写进 `scripts/check_paper.js`。

## 1. 页面必须回答的内容

- **页首**：论文标题、作者、年份、期刊（卷期页码）。
- **研究问题和答案**：只写问题不够，必须给出论文的答案。答案先用一个短结论，再用一两句话说明条件。
- **两个关键概念**：理解这个问题必须先知道的两个概念，各用一两句白话定义。例如研究"先涨粉还是先变现"，就要先说清 growth 和 monetization 各指什么。
- **论文类型**：先判断是理论文章（analytical model）还是实证文章（empirical），质性研究和概念性论文单独标注，标在右上角。
- **理论文章**写清：主要决策者有哪些；每个决策者的主要权衡（trade-off）；每个决策者的决策变量；博弈顺序（timing）；主要结果和背后的机制。
- **实证文章**写清：数据来源；主要回归模型；因变量和自变量各自怎样定义和测量；结论（哪个 X 怎样影响哪个 Y）和背后的机制。
- **管理学启示**：只写一句。
- 全部用通俗、直观的语言回答。

## 2. 每句话都要有信息量

- 删掉不提供信息的说明。例如 "No empirical data"：右上角已经标了论文类型，这句是多余的。
- 不写口号、比喻和装饰性措辞：authenticity is an investment、unlocks、sheds light、a nuanced interplay、delve、landscape、cashing in wins 等。
- 不用花哨的分节编号和装饰性标题，栏目名直接写 Research question、Model、Main result。
- 不用笼统的概括词，写出具体对象。例如不写 "content features"，写 "brightness, color complexity, faces and composition"。
- 中文稿同理，避免："从 X 到 Y、越来越 Z"式排比，"可 A 可 B 可 C"三连，"X 是一种 Y"式定义句，"一键""帮你"式产品腔，"形成闭环""沉淀"之类的说法。

## 3. 指代清楚

- 不用 she / he / her / his 指代研究对象。直接写 the influencer、the consumer、the platform、the brand、the firm、followers。
- 句子因此变得重复时，换一种写法，例如 "Small influencer: …" / "Large influencer: …"。

## 4. 没有展示模型，就不列参数

- 一页总结不展示模型方程，所以页面上不出现 γ、φ、β、r 之类的参数符号。条件用文字表述：写 "when accepting all offers pays more right away"，不写 "γφ > 1"。
- 参数符号和取值可以写进备注，方便以后对照原文。
- 区分决策变量和外生参数：页面要展示的是决策变量，放在决策者表格里。

## 5. 只写要求的内容

- 不加没被要求的板块，例如 Extensions、Robustness。确实重要时，压成一句放进 resultDetail 或 whyNote。
- 管理学启示只写一句。

## 6. 数字与证据

- 数字带单位和对照：写 "0.19% of subscribers compared with a similar organic video"，不写 "a small loss"。
- 区分相关和因果。观察数据要写 "associations only"，或说明因果证据来自哪项实验。
- 作者的推测要标明，例如 "Likely reason: …"。
- 工作论文版或作者版：页面照常写正式期刊名，备注写 "Working-paper version; check against the published version before citing."
- 年份按期刊正式出版的那一期写，网络首发年份不同时在备注说明。

## 7. 版面

- 能短就短。页面字号固定，超长内容必然溢出；检查脚本的上限是最低要求。
- 变量表最多 4–5 行；行内文字超过一行时，删去次要变量（控制变量、中介变量），改在机制栏说明。
- 机制栏最多 3 条要点和 1 条注释。

## 项目补充

<!-- 某个课题的导师或用户提出新的要求时，改写成"应该怎样写"的规则补在这里；对以后的课题也适用的，再并入上面各节。 -->
