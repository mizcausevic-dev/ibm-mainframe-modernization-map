#!/usr/bin/env node
import { loadMap, renderMarkdown } from "../src/index.js";

const [, , inputPath, formatFlag, format] = process.argv;

if (!inputPath) {
  console.error("Usage: ibm-mainframe-modernization-map <input.json> [--format markdown|json]");
  process.exit(1);
}

const map = await loadMap(inputPath);
console.log(formatFlag === "--format" && format === "json" ? JSON.stringify(map, null, 2) : renderMarkdown(map));
