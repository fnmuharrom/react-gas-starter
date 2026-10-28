# React + Google Apps Script Architecture Reference

This reference explains the core architecture of the `react-gas-starter` template to guide customizations in new projects.

## Core Concepts

### 1. Single-File Inlining for GAS (`vite-plugin-singlefile`)
Google Apps Script Web Apps (`HtmlService.createHtmlOutputFromFile('index')`) do not host external relative assets like separate `.js` or `.css` files out-of-the-box.
- Vite bundles all React code, CSS, and inline SVGs into a single standalone `apps-script/index.html`.
- `vite.config.js` configures `viteSingleFile()` and sets `build.outDir: 'apps-script'`.

### 2. Dual Environment Architecture (`src/services/gasApi.js`)
Development velocity is fast because you don't need to deploy to Google Apps Script for every UI change:
- **Local Dev (`npm run dev`)**:
  - `isGasEnvironment()` returns `false` (since `window.google?.script?.run` is undefined).
  - Calls fall back to `src/services/mockData.js`, complete with realistic artificial network latency (300-500ms) and live in-memory updates.
  - The Navbar shows a yellow `⚡ Local Mock Mode` indicator badge.
- **Production GAS Deployment**:
  - `isGasEnvironment()` returns `true`.
  - Calls `google.script.run.withSuccessHandler(...).withFailureHandler(...)[functionName](...args)`.
  - Promisified through `callGasFunction(name, ...args)`.
  - The Navbar shows a green `☁️ Google Apps Script` badge.

### 3. Backend & Spreadsheet Schema (`apps-script/Code.js`)
- `doGet()` serves `index.html`.
- `getSheetData()` returns all records as structured JSON objects mapped from the header row.
- `addItem(newItem)` appends a new record to the sheet.
- Sheet initialization: Automatically creates the tab with default headers and seed sample data if it doesn't exist.

### 4. Clasp Workflow
- `.clasp.json` points `"rootDir": "apps-script"`.
- `npm run build:push` runs `vite build` followed by `clasp push`.
