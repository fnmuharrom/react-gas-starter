#!/usr/bin/env bash
set -euo pipefail

# Scaffolds a new React + Google Apps Script project from react-gas-starter
# Usage: ./init.sh <target-directory> [project-name] [clasp-script-id]

TEMPLATE_REPO="git@fnmuharrom.github.com:fnmuharrom/react-gas-starter.git"
FALLBACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)/MyWorkspaces/developments/app-script/react-gas-starter"

TARGET_DIR="${1:-}"
PROJECT_NAME="${2:-}"
SCRIPT_ID="${3:-}"

if [ -z "$TARGET_DIR" ]; then
  echo "❌ Error: Target directory is required."
  echo "Usage: $0 <target-directory> [project-name] [clasp-script-id]"
  exit 1
fi

TARGET_DIR_ABS="$(mkdir -p "$TARGET_DIR" && cd "$TARGET_DIR" && pwd)"

if [ -z "$PROJECT_NAME" ]; then
  PROJECT_NAME="$(basename "$TARGET_DIR_ABS")"
fi

echo "🚀 Initializing React + GAS Project in: $TARGET_DIR_ABS"
echo "📦 Project Name: $PROJECT_NAME"

# Check if target directory is non-empty
if [ "$(ls -A "$TARGET_DIR_ABS" 2>/dev/null)" ]; then
  echo "⚠️ Warning: Target directory is not empty. Existing files might be overwritten."
fi

# Clone template into a temporary location or directly
TMP_CLONE="$(mktemp -d)"
trap 'rm -rf "$TMP_CLONE"' EXIT

echo "📥 Fetching template from $TEMPLATE_REPO..."
if git clone --depth 1 "$TEMPLATE_REPO" "$TMP_CLONE" 2>/dev/null; then
  echo "✅ Successfully cloned template."
elif [ -d "$FALLBACK_DIR" ]; then
  echo "ℹ️ Remote clone failed or offline, copying from local starter: $FALLBACK_DIR"
  cp -R "$FALLBACK_DIR/"* "$FALLBACK_DIR/".[!.]* "$TMP_CLONE/" 2>/dev/null || true
else
  echo "❌ Error: Failed to fetch template repository."
  exit 1
fi

# Remove .git from cloned template
rm -rf "$TMP_CLONE/.git"

# Copy files to target directory
cp -R "$TMP_CLONE/." "$TARGET_DIR_ABS/"

cd "$TARGET_DIR_ABS"

# Update package.json name
if [ -f "package.json" ]; then
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.name = '$PROJECT_NAME';
    pkg.version = '0.1.0';
    pkg.description = 'Google Apps Script Web App built with React and Vite';
    delete pkg.repository;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "
  echo "✅ Updated package.json with name '$PROJECT_NAME'"
fi

# Configure .clasp.json if script ID is provided
if [ -n "$SCRIPT_ID" ]; then
  cat <<EOF > .clasp.json
{
  "scriptId": "$SCRIPT_ID",
  "rootDir": "apps-script"
}
EOF
  echo "✅ Configured .clasp.json with Script ID: $SCRIPT_ID"
else
  if [ -f ".clasp.json.example" ] && [ ! -f ".clasp.json" ]; then
    cp .clasp.json.example .clasp.json
    echo "ℹ️ Created .clasp.json from example template (fill in scriptId later)."
  fi
fi

# Initialize fresh git repository
echo "🌱 Initializing clean git repository..."
git init -b main
git add .
git commit -m "feat: initial commit from react-gas-starter for $PROJECT_NAME"

echo ""
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🎉 Project '$PROJECT_NAME' initialized successfully!"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_DIR_ABS"
echo "  2. npm run dev           # Start local Vite dev server with mock sheet data"
echo "  3. (Optional) Set your Apps Script ID in .clasp.json"
echo "  4. npm run build:push    # Build single-file bundle and push to Apps Script"
