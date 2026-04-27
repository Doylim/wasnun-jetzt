/**
 * Lighthouse-Wrapper fuer den stress-tester-Agent.
 *
 * Liest die Routenliste aus lighthouse-routes.json (im Projekt-Root)
 * oder testet nur "/" wenn keine vorhanden ist.
 *
 * Nutzung:
 *   node scripts/lighthouse.mjs
 *
 * ENV:
 *   TEST_BASE_URL  -- Standard: http://localhost:3000
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const outDir = resolve("lighthouse-reports");
const routesFile = resolve("lighthouse-routes.json");

const routes = existsSync(routesFile)
  ? JSON.parse(readFileSync(routesFile, "utf-8"))
  : ["/"];

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });

const summary = [];

try {
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    process.stdout.write(`Lighthouse: ${url} ... `);
    const result = await lighthouse(url, {
      port: chrome.port,
      output: ["json", "html"],
      logLevel: "error",
    });
    if (!result) {
      console.log("FEHLER");
      continue;
    }
    const safeName = route.replace(/\//g, "_") || "_root";
    writeFileSync(`${outDir}/${safeName}.json`, result.report[0]);
    writeFileSync(`${outDir}/${safeName}.html`, result.report[1]);

    const cats = result.lhr.categories;
    const scores = {
      route,
      url,
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
    };
    summary.push(scores);
    console.log(
      `Perf ${scores.performance} / A11y ${scores.accessibility} / BP ${scores.bestPractices} / SEO ${scores.seo}`,
    );
  }

  writeFileSync(`${outDir}/summary.json`, JSON.stringify(summary, null, 2));
} finally {
  // Auf Windows wirft chrome-launcher beim Loeschen der Temp-Datei manchmal
  // EPERM, obwohl Chrome sauber beendet wurde. Cleanup-Fehler ignorieren.
  try {
    await chrome.kill();
  } catch (err) {
    if (err?.code !== "EPERM") throw err;
  }
}

const failed = summary.filter(
  (s) => s.performance < 85 || s.accessibility < 90 || s.seo < 90,
);
if (failed.length > 0) {
  console.log("\nUnter Schwelle:");
  failed.forEach((f) => console.log(`  ${f.route}: P${f.performance} A${f.accessibility} S${f.seo}`));
  process.exit(1);
}
