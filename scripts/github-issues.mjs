#!/usr/bin/env node
// Transforma docs/features.json em issues do GitHub.
// Uso:
//   node scripts/github-issues.mjs                      simulação: só mostra o que seria criado
//   node scripts/github-issues.mjs --repo dono/nome --apply   cria rótulos e issues (pula as que já existem)
//   node scripts/github-issues.mjs --markdown           regera docs/FEATURES.md
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const repoIdx = args.indexOf("--repo");
const repo = repoIdx >= 0 ? args[repoIdx + 1] : undefined;
const features = JSON.parse(readFileSync(new URL("../docs/features.json", import.meta.url), "utf8"));

const titulo = (f) => `${f.id} ${f.titulo}`;
const labels = (f) => [`fase-${f.fase}`, `area:${f.area}`, "feature"];

function corpo(f) {
  const l = [];
  l.push(`Fase ${f.fase}. Estado atual: ${f.status}.`);
  if (f.telas.length) l.push(`\nTelas em docs/WIREFRAMES.md: ${f.telas.join(", ")}`);
  if (f.blocos.length) l.push(`\nBlocos:\n${f.blocos.map((b) => `- ${b}`).join("\n")}`);
  l.push(`\nCritérios de aceite:\n${f.aceite.map((a) => `- [ ] ${a}`).join("\n")}`);
  l.push(`\nBranch sugerida: feature/${f.id}-${f.titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`);
  l.push("\nO pull request deve conter `Closes #<número desta issue>`.");
  return l.join("\n");
}

if (args.includes("--markdown")) {
  const linhas = ["# Features", "", "Gerado por `scripts/github-issues.mjs --markdown` a partir de `features.json`.", "", "| ID | Feature | Fase | Área | Telas | Estado |", "| --- | --- | --- | --- | --- | --- |"];
  for (const f of features) linhas.push(`| ${f.id} | ${f.titulo} | ${f.fase} | ${f.area} | ${f.telas.join(", ") || "-"} | ${f.status} |`);
  writeFileSync(new URL("../docs/FEATURES.md", import.meta.url), linhas.join("\n") + "\n");
  console.log("docs/FEATURES.md atualizado.");
  process.exit(0);
}

if (!apply) {
  for (const f of features) console.log(`${titulo(f)}  [${labels(f).join(", ")}]`);
  console.log(`\n${features.length} issues seriam criadas. Nada foi enviado. Use --repo dono/nome --apply.`);
  process.exit(0);
}

if (!repo) {
  console.error("Informe --repo dono/nome junto com --apply.");
  process.exit(1);
}

const gh = (...a) => execFileSync("gh", a, { encoding: "utf8" });
const existentes = new Set(JSON.parse(gh("issue", "list", "--repo", repo, "--state", "all", "--limit", "500", "--json", "title")).map((i) => i.title));

for (const nome of new Set(features.flatMap(labels))) gh("label", "create", nome, "--repo", repo, "--force");

for (const f of features) {
  if (existentes.has(titulo(f))) {
    console.log(`já existe: ${titulo(f)}`);
    continue;
  }
  const url = gh("issue", "create", "--repo", repo, "--title", titulo(f), "--body", corpo(f), ...labels(f).flatMap((x) => ["--label", x])).trim();
  console.log(`${titulo(f)} -> ${url}`);
}
