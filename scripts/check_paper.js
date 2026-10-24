// Checks a paper data file against the slide rules before building.
// Run: node check_paper.js papers/<file>.js [more files...]
const path = require("path");

const SLIDE_FIELDS = ["title", "question", "answerLead", "answer", "resultLead", "resultDetail", "whyNote", "implication",
  "data", "model", "timingNote"];
const BANNED = [
  [/\b(she|her|hers|he|his|him)\b/i, "use 'the influencer', 'the consumer', 'the platform' instead of she/he"],
  [/no empirical data|no empirical sample/i, "filler: drop it, the badge already says the paper type"],
  [/[α-ωΑ-Ω]/, "no parameter symbols on the slide; say it in words (symbols may go in notes)"],
];

function lengthRule(errors, label, value, max) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${label}: missing`);
  else if (value.length > max) errors.push(`${label}: ${value.length} chars > ${max}`);
}

function slideTexts(p) {
  const out = SLIDE_FIELDS.filter((k) => p[k]).map((k) => [k, p[k]]);
  (p.defs || []).forEach((d, i) => out.push([`defs[${i}]`, `${d.head} ${d.body}`]));
  (p.players || []).forEach((r, i) => out.push([`players[${i}]`, r.join(" ")]));
  (p.timing || []).forEach((t, i) => out.push([`timing[${i}]`, t]));
  (p.variables || []).forEach((r, i) => out.push([`variables[${i}]`, r.join(" ")]));
  (p.why || []).forEach((t, i) => out.push([`why[${i}]`, t]));
  return out;
}

function check(p) {
  const e = [];
  if (!["theory", "empirical", "qualitative", "conceptual"].includes(p.type)) e.push("type: must be theory | empirical | qualitative | conceptual");
  lengthRule(e, "title", p.title, 130);
  lengthRule(e, "authors", p.authors, 90);
  lengthRule(e, "journal", p.journal, 50);
  if (!p.year) e.push("year: missing");
  lengthRule(e, "question", p.question, 150);
  lengthRule(e, "answerLead", p.answerLead, 40);
  lengthRule(e, "answer", p.answer, 190);
  if (!Array.isArray(p.defs) || p.defs.length !== 2) e.push("defs: need exactly 2 concept cards");
  else p.defs.forEach((d, i) => { lengthRule(e, `defs[${i}].head`, d.head, 25); lengthRule(e, `defs[${i}].body`, d.body, 150); });

  if (p.type === "theory") {
    if (!Array.isArray(p.players) || p.players.length < 2 || p.players.length > 3) e.push("players: 2-3 rows");
    else p.players.forEach((r, i) => {
      lengthRule(e, `players[${i}][0]`, r[0], 22); lengthRule(e, `players[${i}][1]`, r[1], 75); lengthRule(e, `players[${i}][2]`, r[2], 85);
    });
    if (!Array.isArray(p.timing) || p.timing.length < 3 || p.timing.length > 5) e.push("timing: 3-5 steps");
    else p.timing.forEach((t, i) => lengthRule(e, `timing[${i}]`, t, 38));
    lengthRule(e, "timingNote", p.timingNote, 80);
  } else {
    lengthRule(e, "data", p.data, 175);
    lengthRule(e, "model", p.model, 175);
    if (!Array.isArray(p.variables) || p.variables.length < 3 || p.variables.length > 5) e.push("variables: 3-5 rows");
    else p.variables.forEach((r, i) => {
      // concept labels in qualitative/conceptual tables may wrap to a second line; roles must not
      lengthRule(e, `variables[${i}][0]`, r[0], p.type === "empirical" ? 12 : 16);
      lengthRule(e, `variables[${i}][1]`, r[1], 26); lengthRule(e, `variables[${i}][2]`, r[2], 85);
    });
  }

  lengthRule(e, "resultLead", p.resultLead, 125);
  lengthRule(e, "resultDetail", p.resultDetail, 175);
  // limits calibrated on the two pages checked in PowerPoint (Nistor 2025, Wies 2023)
  const maxBullet = p.chart ? 110 : 140, maxTotal = p.chart ? 260 : 420;
  if (!Array.isArray(p.why) || p.why.length < 2 || p.why.length > 4) e.push("why: 2-4 bullets");
  else {
    p.why.forEach((t, i) => lengthRule(e, `why[${i}]`, t, maxBullet));
    const total = p.why.join("").length;
    if (total > maxTotal) e.push(`why: ${total} chars in total > ${maxTotal}`);
  }
  if (p.whyNote) lengthRule(e, "whyNote", p.whyNote, 90);
  lengthRule(e, "implication", p.implication, 220);
  if (!Array.isArray(p.notes) || !p.notes.length) e.push("notes: add the full citation and where each claim is in the paper");

  // Estimated layout: characters per line come from each box's width and font size (checked in PowerPoint).
  const lines = (text, cpl) => (text ? Math.ceil(text.length / (cpl * 0.9)) : 0);
  const fit = (label, used, max) => { if (used > max) e.push(`${label}: about ${used} lines, only ${max} fit; shorten it`); };
  fit("question + answer", lines(`Question  ${p.question || ""}`, 98) + lines(`Answer  ${p.answerLead || ""} ${p.answer || ""}`, 98), 5);
  (p.defs || []).forEach((d, i) => fit(`defs[${i}].body`, lines(d.body, 44), 4));
  fit("resultLead + resultDetail", lines(p.resultLead, 94) + lines(p.resultDetail, 104), 4);
  const whyLines = (p.why || []).reduce((s, t) => s + lines(t, p.chart ? 42 : 92), 0) + lines(p.whyNote, p.chart ? 46 : 96);
  fit("why + whyNote", whyLines, p.chart ? 10 : 9);
  if (p.type === "theory" && Array.isArray(p.timing)) {
    const cpl = p.timing.length >= 5 ? 17 : 22;
    p.timing.forEach((t, i) => fit(`timing[${i}]`, lines(`${i + 1}  ${t}`, cpl), p.timing.length >= 5 ? 4 : 3));
  }
  if (p.type !== "theory") {
    fit("data + model", lines(`Data  ${p.data || ""}`, 100) + lines(`Model  ${p.model || ""}`, 100), 4);
    if (Array.isArray(p.variables)) {
      // a row is as tall as its longest cell; 0.06" padding + 0.165" per line at 10pt
      const height = p.variables.reduce((s, r) => s + 0.06 + 0.165 * Math.max(lines(r[1], 24), lines(r[2], 62), 1), 0);
      const avail = 6.62 - (3.52 + (p.dataBoxH || 1.0) + 0.14) - 0.28;
      if (height > avail) e.push(`variables: table needs about ${height.toFixed(2)}" but only ${avail.toFixed(2)}" fit; cut a row or shorten cells`);
    }
  }

  for (const [field, text] of slideTexts(p)) {
    for (const [re, msg] of BANNED) if (re.test(text)) e.push(`${field}: ${msg}`);
  }
  return e;
}

let failed = 0;
for (const file of process.argv.slice(2)) {
  const p = require(path.resolve(file));
  const errors = check(p);
  if (errors.length) {
    failed++;
    console.log(`FAIL ${file}`);
    errors.forEach((x) => console.log(`  - ${x}`));
  } else console.log(`OK   ${file}`);
}
process.exit(failed ? 1 : 0);
