---
name: create-react-gas-app
description: >-
  Scaffold and initialize a new Google Apps Script Web App project using the react-gas-starter
  template (React 19, Vite single-file inlining, Google Sheets backend, and clasp deployment).
  Use this skill whenever the user wants to start, scaffold, create, or initialize a new React
  Google Apps Script (GAS) or Google Sheets web application.
---

# Create React GAS App

Use this skill to scaffold and configure a production-ready Google Apps Script (GAS) Web App powered by **React 19**, **Vite**, and **Google Sheets** using the `react-gas-starter` template.

For architecture details, refer to [Architecture Reference](./references/architecture.md).

---

## 🛠️ Automated Project Scaffolding

To quickly scaffold a new project, execute the bundled helper script [init.sh](./scripts/init.sh):

```bash
# Syntax: ./scripts/init.sh <target-directory> [project-name] [clasp-script-id]
~/.gemini/config/skills/create-react-gas-app/scripts/init.sh /path/to/my-new-app "my-new-app"
```

The script automatically:
1. Clones the template from `git@fnmuharrom.github.com:fnmuharrom/react-gas-starter.git` (or falls back to local starter cache).
2. Cleans out template git history.
3. Updates `package.json` with the new project name and reset version.
4. Prepares `.clasp.json` (optionally populating the Script ID).
5. Initializes a fresh `main` git branch and creates the initial commit.
6. Runs `npm install`.

---

## 📋 Manual Scaffolding Procedure

If executing step-by-step:

### 1. Clone & Clean Template
```bash
git clone --depth 1 git@fnmuharrom.github.com:fnmuharrom/react-gas-starter.git <project-directory>
cd <project-directory>
rm -rf .git
```

### 2. Update Metadata
In `package.json`:
- Set `"name"` to `<project-name>`.
- Set `"version"` to `"0.1.0"`.

### 3. Initialize Git
```bash
git init -b main
git add .
git commit -m "feat: initial commit for <project-name>"
```

### 4. Install Dependencies
```bash
npm install
```

---

## ⚙️ Project Customization Checklist

After the project is initialized, ask the user or guide them through these steps:

### 1. Configure Apps Script (Clasp)
- Create or open the target Google Sheet.
- Go to **Extensions > Apps Script** -> **Project Settings ⚙️** -> copy **Script ID**.
- Update `.clasp.json`:
  ```json
  {
    "scriptId": "<YOUR_SCRIPT_ID>",
    "rootDir": "apps-script"
  }
  ```

### 2. Customize Data Schema & Columns
When adapting the starter to a specific domain (e.g., invoices, asset tracking, employee directory):
1. **Backend (`apps-script/Code.js`)**:
   - Update `SHEET_NAME` and `DEFAULT_HEADERS`.
   - Update `SAMPLE_DATA` seed rows.
   - Adjust `addItem(newItem)` to append the domain-specific fields.
2. **Local Mock (`src/services/mockData.js`)**:
   - Mirror the same headers and mock data structure so local development matches production.
3. **Frontend API (`src/services/gasApi.js`)**:
   - Add any domain-specific GAS functions wrapped with `callGasFunction`.
4. **UI Components (`src/components/`)**:
   - Update `DataTable.jsx` columns.
   - Update `AddItemModal.jsx` form inputs.
   - Update `FilterBar.jsx` categories and status options.

---

## 🔍 Validation & Verification

Always verify the newly scaffolded project:

1. **Verify Local Dev Server**:
   ```bash
   npm run dev
   ```
   Ensure the local Vite server starts and mock data displays properly.

2. **Verify Single-File Bundle Build**:
   ```bash
   npm run build
   ```
   Ensure `apps-script/index.html` is generated with all JS/CSS inlined.

3. **Verify Deployment (when clasp is configured)**:
   ```bash
   npm run build:push
   ```
   Confirm files are pushed to Google Apps Script.
