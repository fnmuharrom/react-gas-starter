/**
 * Google Apps Script Backend for React GAS Starter
 */

const CONFIG = {
  DEFAULT_SHEET_NAME: "Data",
  TITLE: "Google Sheets React App",
};

/**
 * Serves the single-page web app built by Vite
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle(CONFIG.TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/**
 * Standarized API response format
 */
function jsonSuccess(data, message = "Success") {
  return {
    success: true,
    data: data,
    message: message,
    timestamp: new Date().toISOString(),
  };
}

function jsonError(error) {
  Logger.log("Error: " + error);
  return {
    success: false,
    error: error.message || String(error),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get or create the data sheet, and seeds demo data if blank
 */
function getOrCreateSheet(sheetName) {
  if (!sheetName || typeof sheetName !== "string" || sheetName.trim() === "") {
    sheetName = CONFIG.DEFAULT_SHEET_NAME;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "Spreadsheet aktif tidak ditemukan. Pastikan Apps Script ini terikat (container-bound) ke Google Sheets, atau buka melalui menu Extensions > Apps Script pada Google Sheet terkait."
    );
  }
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    const sheets = ss.getSheets();
    // Jika spreadsheet hanya memiliki 1 sheet dan masih kosong (misal "Sheet1" default baru), gunakan sheet tersebut
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName(sheetName);
    } else {
      sheet = ss.insertSheet(sheetName);
    }
    seedSampleData(sheet);
  } else if (sheet.getLastRow() === 0) {
    seedSampleData(sheet);
  }

  return sheet;
}

/**
 * Seed initial sample data into the sheet.
 * Can be executed directly from Google Apps Script editor toolbar or called internally.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} [sheet]
 */
function seedSampleData(sheet) {
  if (!sheet || typeof sheet.clear !== "function") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error(
        "Spreadsheet aktif tidak ditemukan. Pastikan script ini terikat (container-bound) ke Google Sheets."
      );
    }
    sheet = ss.getSheetByName(CONFIG.DEFAULT_SHEET_NAME);
    if (!sheet) {
      const sheets = ss.getSheets();
      if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
        sheet = sheets[0];
        sheet.setName(CONFIG.DEFAULT_SHEET_NAME);
      } else {
        sheet = ss.insertSheet(CONFIG.DEFAULT_SHEET_NAME);
      }
    }
  }

  const headers = [
    "ID",
    "Title",
    "Category",
    "Status",
    "Quantity",
    "Amount",
    "Date",
    "Notes",
  ];

  const sampleRows = [
    [
      "ITEM-001",
      "Ergonomic Office Chair",
      "Office Supplies",
      "In Stock",
      15,
      1750000,
      "2026-03-01",
      "High back mesh chair with lumbar support",
    ],
    [
      "ITEM-002",
      "Mechanical Keyboard 75%",
      "Hardware",
      "In Stock",
      24,
      1200000,
      "2026-03-02",
      "Hot-swappable switches, wireless connection",
    ],
    [
      "ITEM-003",
      "Ultra-wide Monitor 34\"",
      "Hardware",
      "Low Stock",
      4,
      5600000,
      "2026-03-03",
      "IPS curved display with USB-C Hub",
    ],
    [
      "ITEM-004",
      "Standing Desk Frame",
      "Office Supplies",
      "Out of Stock",
      0,
      3200000,
      "2026-03-04",
      "Dual motor adjustable desk",
    ],
    [
      "ITEM-005",
      "USB-C Docking Station",
      "Accessories",
      "In Stock",
      35,
      850000,
      "2026-03-05",
      "10-in-1 multi-port adapter",
    ],
    [
      "ITEM-006",
      "Noise-Cancelling Headset",
      "Accessories",
      "In Stock",
      18,
      1450000,
      "2026-03-06",
      "Bluetooth 5.3 with boom mic",
    ],
    [
      "ITEM-007",
      "Desk Mat Felt & Leather",
      "Accessories",
      "In Stock",
      50,
      220000,
      "2026-03-07",
      "Water resistant, 90x40cm",
    ],
  ];

  sheet.clear();
  sheet.appendRow(headers);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#F3F4F6");

  // Add rows
  sampleRows.forEach((row) => sheet.appendRow(row));

  Logger.log("Sample data seeded successfully to sheet: " + sheet.getName());
  return sheet;
}

/**
 * API: Fetch list of records from Google Sheet
 * @param {string} sheetName - Optional sheet name (defaults to CONFIG.DEFAULT_SHEET_NAME)
 * @returns {Object} JSON response object with data array
 */
function getSheetData(sheetName) {
  try {
    const targetSheet = getOrCreateSheet(sheetName);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tz = ss.getSpreadsheetTimeZone();

    const dataRange = targetSheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length <= 1) {
      return jsonSuccess([], "No records found");
    }

    const headers = values[0];
    const rows = values.slice(1);

    const items = rows.map((row) => {
      const obj = {};
      headers.forEach((header, colIdx) => {
        let val = row[colIdx];
        if (val instanceof Date) {
          val = Utilities.formatDate(val, tz, "yyyy-MM-dd");
        }
        obj[header] = val;
      });
      return obj;
    });

    return jsonSuccess(items, "Successfully retrieved data");
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * API: Add a new item to Google Sheet
 */
function addItem(itemData) {
  try {
    const targetSheet = getOrCreateSheet();
    const headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];

    // Generate ID if missing
    if (!itemData.ID) {
      itemData.ID = "ITEM-" + Date.now().toString().slice(-6);
    }

    const row = headers.map((header) => itemData[header] ?? "");
    targetSheet.appendRow(row);

    return jsonSuccess(itemData, "Item added successfully");
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * API: Get application metadata and spreadsheet summary
 */
function getAppInfo() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet();

    return jsonSuccess({
      spreadsheetName: ss.getName(),
      sheetName: sheet.getName(),
      totalRows: Math.max(0, sheet.getLastRow() - 1),
      timezone: ss.getSpreadsheetTimeZone(),
      userEmail: Session.getActiveUser().getEmail() || "anonymous",
    });
  } catch (error) {
    return jsonError(error);
  }
}
