// Builds a deck with one reading-summary slide per paper, grouped into PowerPoint sections.
// Usage: node build_deck.js <deck.json> [output.pptx]
//
// deck.json:
//   { "title": "My reading summaries", "papersDir": "papers",
//     "sections": [ { "title": "Seed papers", "ids": ["nistor2025", "wies2023"] } ] }
// papersDir is relative to deck.json. Each id is a file <papersDir>/<id>.js (see references/field_spec.md).
// Papers whose file does not exist yet are skipped with a warning.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { FONTS, renderPaper } = require("./slide_lib");

function loadConfig(file) {
  const cfg = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (!Array.isArray(cfg.sections) || !cfg.sections.length) throw new Error(`${file}: "sections" must be a non-empty array`);
  return { ...cfg, papersDir: path.resolve(path.dirname(file), cfg.papersDir || "papers") };
}

async function main() {
  const [configFile, outArg] = process.argv.slice(2);
  if (!configFile) {
    console.error("usage: node build_deck.js <deck.json> [output.pptx]");
    process.exit(2);
  }
  const cfg = loadConfig(configFile);
  const out = outArg || path.join(path.dirname(configFile), `${cfg.title || "deck"}.pptx`);

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: FONTS.head, bodyFontFace: FONTS.body };
  pres.title = cfg.title || "Reading summaries";

  let count = 0;
  for (const { title, ids } of cfg.sections) {
    const present = ids.filter((id) => {
      const ok = fs.existsSync(path.join(cfg.papersDir, `${id}.js`));
      if (!ok) console.warn(`skip ${id}: ${id}.js not found in ${cfg.papersDir}`);
      return ok;
    });
    if (!present.length) continue;
    pres.addSection({ title });
    for (const id of present) {
      renderPaper(pres, require(path.join(cfg.papersDir, `${id}.js`)), title);
      count++;
    }
  }
  await pres.writeFile({ fileName: out });
  console.log(`wrote ${count} slides -> ${out}`);
}

main().catch((err) => {
  console.error("build failed:", err.message);
  process.exit(1);
});
