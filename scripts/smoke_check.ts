import { readFile } from "node:fs/promises";

const html = await readFile("site/index.html", "utf8");
const markers = [
  "IBM Mainframe Modernization Map",
  "Mainframe risk becomes an investment sequence",
  "Claims settlement batch",
  "Primary recommendation"
];

for (const marker of markers) {
  if (!html.includes(marker)) {
    throw new Error(`Missing marker: ${marker}`);
  }
}

console.log("smoke ok");
