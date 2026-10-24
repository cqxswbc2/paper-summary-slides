// One-page reading summary, one slide per paper.
// Layout: header, research question + two concept cards, model/data block (left), main result (right),
// one-sentence managerial implication. Theory papers and empirical papers differ only in the left block.
// Colors are written as hex values, so the deck needs no separate theme step.

const HEX = {
  ink: "1B2F2A", green: "236C56", deep: "183D37", tint: "EEF4F1", tint2: "F7FAF8",
  muted: "5F6E69", amber: "C9821A", gray: "9AA6A2", line: "CFDCD6", white: "FFFFFF", pale: "CFE3DA",
};
const FONTS = { head: "Cambria", body: "Calibri" };
// named roles used throughout the layout
const C = {
  text1: HEX.ink, text2: HEX.deep, accent1: HEX.green, accent2: HEX.amber, accent3: HEX.gray,
  accent4: HEX.muted, background1: HEX.white,
};

const L = 0.45, R = 12.883, GAP = 0.25, COL2 = 7.0;
const LEFT_W = COL2 - GAP - L;
const RIGHT_W = R - COL2;
const TYPE_LABEL = {
  theory: "Theory paper (analytical model)", empirical: "Empirical paper",
  qualitative: "Qualitative study", conceptual: "Conceptual paper",
};

function renderPaper(pres, p, sectionTitle) {
  const s = pres.addSlide({ sectionTitle });
  s.background = { color: HEX.white };

  const T = (text, opts) => s.addText(text, { isTextBox: true, margin: 0, valign: "top", color: C.text1, fontSize: 11.5, ...opts });
  const heading = (text, x, y, w) =>
    T(text, { x, y, w, h: 0.28, fontFace: "Cambria", bold: true, fontSize: 14, color: C.accent1, objectName: `Heading ${text}` });
  const card = (x, y, w, h, name, fill = HEX.tint) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });
  const table = (rows, opts) => s.addTable(rows, {
    margin: [0.04, 0.08, 0.04, 0.08], valign: "middle", color: HEX.ink, fontFace: "Calibri",
    border: { type: "solid", pt: 0.75, color: HEX.line }, fill: { color: HEX.white }, objectName: "Table", ...opts,
  });

  // ---------- Header ----------
  // Titles longer than one line at 26pt go to two lines at 20pt; the author line moves down to make room.
  const longTitle = p.title.length > 50;
  T(p.title, {
    x: L, y: longTitle ? 0.2 : 0.3, w: 9.6, h: longTitle ? 0.74 : 0.5, fontFace: "Cambria", bold: true,
    fontSize: longTitle ? 20 : 26, color: C.text2, valign: "middle", objectName: "Paper title",
  });
  T([
    { text: p.authors, options: { bold: true, color: C.text1 } },
    { text: `  |  ${p.year}  |  `, options: { color: C.accent4 } },
    { text: p.journal, options: { italic: true, color: C.text1 } },
    { text: p.volume ? `, ${p.volume}` : "", options: { color: C.accent4 } },
  ], { x: L, y: longTitle ? 0.98 : 0.86, w: 9.6, h: 0.28, fontSize: 12.5, objectName: "Authors year journal" });
  card(10.3, 0.42, R - 10.3, 0.5, "Paper type badge", HEX.deep);
  T(p.typeLabel || TYPE_LABEL[p.type], {
    x: 10.3, y: 0.42, w: R - 10.3, h: 0.5, bold: true, fontSize: 12, color: C.background1, align: "center", valign: "middle", objectName: "Paper type text",
  });

  // ---------- Research question ----------
  const Y1 = 1.32;
  heading("Research question", L, Y1, 6);
  const CY = Y1 + 0.36, CH = 1.22;
  const QW = 6.15, DW = (R - L - QW - 2 * GAP) / 2;
  card(L, CY, QW, CH, "QA card");
  T([
    { text: "Question  ", options: { bold: true, color: C.accent1 } },
    { text: p.question, options: { breakLine: true } },
    { text: "Answer  ", options: { bold: true, color: C.accent2 } },
    { text: p.answerLead + " ", options: { bold: true } },
    { text: p.answer },
  ], { x: L + 0.18, y: CY + 0.13, w: QW - 0.36, h: CH - 0.2, paraSpaceAfter: 6, objectName: "QA text" });
  p.defs.forEach((d, i) => {
    const x = L + QW + GAP + i * (DW + GAP);
    card(x, CY, DW, CH, `${d.head} card`, HEX.tint2);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: CY, w: DW, h: CH, rectRadius: 0.08, fill: { type: "none" }, line: { color: HEX.line, width: 1 }, objectName: `${d.head} outline` });
    T([
      { text: d.head, options: { bold: true, color: C.accent1, breakLine: true } },
      { text: d.body, options: { fontSize: 11 } },
    ], { x: x + 0.15, y: CY + 0.13, w: DW - 0.3, h: CH - 0.2, paraSpaceAfter: 3, objectName: `${d.head} text` });
  });

  // ---------- Left block ----------
  const Y2 = CY + CH + 0.26;
  const ctx = { T, heading, card, table, C, Y2 };
  if (p.type === "theory") renderTheoryModel(ctx, p);
  else renderEmpiricalModel(ctx, p);

  // ---------- Main result ----------
  heading("Main result", COL2, Y2, RIGHT_W);
  T([
    { text: p.resultLead, options: { bold: true, breakLine: true } },
    { text: p.resultDetail, options: { color: C.accent4, fontSize: 11 } },
  ], { x: COL2, y: Y2 + 0.36, w: RIGHT_W, h: 0.9, paraSpaceAfter: 4, objectName: "Main result" });

  const CHY = Y2 + 1.3, CHH = 1.95;
  const whyX = p.chart ? COL2 + 3.1 + 0.2 : COL2;
  if (p.chart) addChart(pres, s, p.chart, { x: COL2, y: CHY, w: 3.1, h: CHH });
  const why = [{ text: "Why", options: { bold: true, color: C.accent1, breakLine: true } }];
  p.why.forEach((b, i) => why.push({ text: b, options: { bullet: { indent: 12 }, breakLine: i < p.why.length - 1 || !!p.whyNote } }));
  if (p.whyNote) why.push({ text: p.whyNote, options: { color: C.accent4, fontSize: 10.5 } });
  T(why, { x: whyX, y: CHY + 0.02, w: R - whyX, h: CHH + 0.15, fontSize: p.chart ? 10.5 : 11, paraSpaceAfter: 4, objectName: "Mechanism" });

  // ---------- Managerial implication ----------
  const IY = 6.72;
  card(L, IY, R - L, 0.5, "Implication band", HEX.deep);
  T([
    { text: "Managerial implication   ", options: { bold: true, fontFace: "Cambria", color: HEX.pale, fontSize: 12 } },
    { text: p.implication, options: { color: C.background1 } },
  ], { x: L + 0.2, y: IY + 0.04, w: R - L - 0.4, h: 0.42, fontSize: 12, valign: "middle", objectName: "Implication text" });

  if (p.notes) s.addNotes(p.notes.join("\n"));
}

function renderTheoryModel({ T, heading, card, table, C, Y2 }, p) {
  heading("Model", L, Y2, LEFT_W);
  const th = (t) => ({ text: t, options: { bold: true, color: HEX.white, fill: { color: HEX.green }, fontSize: 11 } });
  const td = (t, extra = {}) => ({ text: t, options: { fontSize: 11, ...extra } });
  const rows = [[th("Decision maker"), th("Trade-off"), th("Decision variable")],
    ...p.players.map((r) => [td(r[0], { bold: true }), td(r[1]), td(r[2])])];
  const TBY = Y2 + 0.36;
  const rowH = [0.32, ...(p.playerRowH || p.players.map(() => (p.players.length > 2 ? 0.46 : 0.56)))];
  table(rows, { x: L, y: TBY, w: LEFT_W, colW: [1.3, 2.35, LEFT_W - 3.65], rowH });

  const TY = TBY + rowH.reduce((a, b) => a + b, 0) + 0.3;
  T([
    { text: "Timing", options: { bold: true, color: C.accent1 } },
    { text: "   " + p.timingNote, options: { color: C.accent4 } },
  ], { x: L, y: TY, w: LEFT_W, h: 0.24, fontSize: 11, objectName: "Timing label" });
  // five narrow steps need a smaller font and every bit of height down to the implication band
  const n = p.timing.length, AW = n >= 5 ? 0.14 : 0.2, SW = (LEFT_W - (n - 1) * AW) / n, SY = TY + 0.32;
  const SH = n >= 5 ? Math.max(0.6, 6.6 - SY) : Math.min(0.75, 6.5 - SY);
  const stepFont = n >= 5 ? 10 : 11;
  p.timing.forEach((txt, i) => {
    const x = L + i * (SW + AW);
    card(x, SY, SW, SH, `Timing step ${i + 1}`);
    T([
      { text: `${i + 1}  `, options: { bold: true, fontFace: "Cambria", color: C.accent1 } },
      { text: txt },
    ], { x: x + 0.08, y: SY + 0.04, w: SW - 0.16, h: SH - 0.08, fontSize: stepFont, valign: "middle", objectName: `Timing step ${i + 1} text` });
    if (i < n - 1) T("›", { x: x + SW, y: SY, w: AW, h: SH, fontSize: 18, bold: true, color: C.accent3, align: "center", valign: "middle", objectName: `Timing arrow ${i + 1}` });
  });
}

// Empirical, qualitative and conceptual papers share this block; labels can be overridden per paper.
function renderEmpiricalModel({ T, heading, card, table, C, Y2 }, p) {
  heading(p.leftHeading || "Data and model", L, Y2, LEFT_W);
  const DY = Y2 + 0.36, DH = p.dataBoxH || 1.0;
  card(L, DY, LEFT_W, DH, "Data and model card");
  T([
    { text: (p.dataLabel || "Data") + "  ", options: { bold: true, color: C.accent1 } },
    { text: p.data, options: { breakLine: true } },
    { text: (p.modelLabel || "Model") + "  ", options: { bold: true, color: C.accent1 } },
    { text: p.model },
  ], { x: L + 0.15, y: DY + 0.1, w: LEFT_W - 0.3, h: DH - 0.16, fontSize: 11, paraSpaceAfter: 4, objectName: "Data and model text" });

  const th = (t) => ({ text: t, options: { bold: true, color: HEX.white, fill: { color: HEX.green }, fontSize: 10.5 } });
  const td = (t, extra = {}) => ({ text: t, options: { fontSize: 10, ...extra } });
  const headers = p.tableHeaders || ["Role", "Variable", "How it is measured"];
  const rows = [headers.map(th),
    ...p.variables.map((r) => [td(r[0], { bold: true }), td(r[1]), td(r[2])])];
  const VY = DY + DH + 0.14;
  const bodyH = (6.35 - VY - 0.28) / p.variables.length;
  table(rows, {
    x: L, y: VY, w: LEFT_W, colW: [1.1, 1.6, LEFT_W - 2.7], rowH: [0.28, ...p.variables.map(() => bodyH)],
    margin: [0.03, 0.08, 0.03, 0.08],
  });
}

function addChart(pres, s, chart, box) {
  const opts = {
    ...box, objectName: "Result chart",
    chartColors: chart.colors || [HEX.green, HEX.amber, HEX.gray], lineSize: 2, lineDataSymbol: "none",
    showTitle: true, title: chart.title, titleFontSize: 10, titleColor: HEX.ink, titleFontFace: "+mn-lt",
    showLegend: chart.series.length > 1, legendPos: "b", legendFontSize: 8.5, legendColor: HEX.muted, legendFontFace: "+mn-lt",
    catAxisLabelFrequency: chart.labelEvery || 1, catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 8, catAxisLabelFontFace: "+mn-lt",
    catAxisLineShow: true, catAxisLineColor: HEX.line, catAxisMajorTickMark: "none",
    valAxisLabelColor: HEX.muted, valAxisLabelFontSize: 8, valAxisLabelFontFace: "+mn-lt", valAxisLineShow: false,
    valGridLine: { color: "E3EAE7", size: 0.5 }, catGridLine: { style: "none" },
    ...(chart.options || {}),
  };
  // data labels keep the paper's own precision (the default format rounds 10.2 to 10)
  if (opts.showValue && !opts.dataLabelFormatCode) opts.dataLabelFormatCode = "General";
  if (chart.catTitle) Object.assign(opts, { showCatAxisTitle: true, catAxisTitle: chart.catTitle, catAxisTitleFontSize: 8.5, catAxisTitleColor: HEX.muted });
  if (chart.valTitle) Object.assign(opts, { showValAxisTitle: true, valAxisTitle: chart.valTitle, valAxisTitleFontSize: 8.5, valAxisTitleColor: HEX.muted });
  s.addChart(pres.charts[chart.type || "LINE"], chart.series, opts);
}

module.exports = { FONTS, HEX, renderPaper };
