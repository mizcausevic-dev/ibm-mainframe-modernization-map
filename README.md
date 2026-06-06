# ibm-mainframe-modernization-map

Board-readable modernization map for IBM mainframe workloads, COBOL/JCL dependency risk, DB2 coupling, API coverage, test posture, and migration sequencing.

[![ci](https://github.com/mizcausevic-dev/ibm-mainframe-modernization-map/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/ibm-mainframe-modernization-map/actions/workflows/ci.yml)
[![pages](https://github.com/mizcausevic-dev/ibm-mainframe-modernization-map/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/ibm-mainframe-modernization-map/actions/workflows/pages.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)

## Why this exists

Mainframe modernization work often gets flattened into vague rewrite language. Executives need sharper sequencing:

- Which workloads should be contained, wrapped, strangled, or rebuilt?
- Where are batch windows, dependencies, test gaps, and API gaps creating migration risk?
- Which modernization investment can be defended with operating evidence?

This repo turns synthetic mainframe telemetry into a board-readable modernization register.

## What it includes

- TypeScript modernization scoring engine
- CLI renderer for markdown and JSON
- Synthetic IBM mainframe workload fixture
- Static proof page for GitHub Pages
- CI, coverage, prerender, smoke checks, and Pages deploy workflow

## Local run

```bash
npm install
npm run verify
npm run demo
```

## CLI

```bash
npx ibm-mainframe-modernization-map fixtures/mainframe-modernization-sample.json --format markdown
npx ibm-mainframe-modernization-map fixtures/mainframe-modernization-sample.json --format json
```

## Data contract

Each workload tracks:

- COBOL, JCL, DB2, Java, CICS, and SQL language signals
- batch window pressure
- dependency count
- API coverage
- test coverage
- documentation coverage
- change failure rate
- annual run cost pressure
- business criticality
- owner, audience, narrative, and next action

## Kinetic Gain fit

This adds a mainframe modernization lane to the Kinetic Gain portfolio: a high-signal enterprise architecture project that connects IBM, COBOL, Java, and SQL evidence to board-level investment decisions.
