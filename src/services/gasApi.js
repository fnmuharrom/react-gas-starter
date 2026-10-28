/**
 * Unified API Client for Google Apps Script
 *
 * Automatically detects whether running inside Google Apps Script iframe
 * or locally in Vite dev server (localhost).
 */

import { INITIAL_MOCK_ITEMS, MOCK_APP_INFO } from "./mockData";

// In-memory store for local mock mutations
let localMockItems = [...INITIAL_MOCK_ITEMS];

/**
 * Check if the application is running inside a Google Apps Script environment
 */
export function isGasEnvironment() {
  return (
    typeof google !== "undefined" &&
    google.script &&
    google.script.run &&
    typeof google.script.run.withSuccessHandler === "function"
  );
}

/**
 * Low-level wrapper around google.script.run returning a Promise
 */
function callGasFunction(functionName, ...args) {
  return new Promise((resolve, reject) => {
    if (!isGasEnvironment()) {
      reject(new Error("Not in Google Apps Script environment"));
      return;
    }

    google.script.run
      .withSuccessHandler((response) => {
        resolve(response);
      })
      .withFailureHandler((error) => {
        console.error(`GAS call error [${functionName}]:`, error);
        reject(error);
      })[functionName](...args);
  });
}

/**
 * Fetch items list from Google Sheet
 * @param {string} [sheetName] - Optional sheet name
 * @returns {Promise<{success: boolean, data: Array, isMock: boolean}>}
 */
export async function getItems(sheetName) {
  if (isGasEnvironment()) {
    try {
      const args = sheetName ? [sheetName] : [];
      const result = await callGasFunction("getSheetData", ...args);
      if (result && result.success) {
        return { success: true, data: result.data || [], isMock: false };
      }
      throw new Error(result?.error || "Failed to load sheet data");
    } catch (err) {
      console.error("Failed to fetch sheet data from GAS:", err);
      throw err;
    }
  }

  // Local development mock with simulated latency
  console.log("⚡ [Local Dev] Using mock Google Sheet data");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [...localMockItems],
        isMock: true,
      });
    }, 400);
  });
}

/**
 * Add a new item to Google Sheet
 * @param {Object} itemData
 */
export async function addItem(itemData) {
  if (isGasEnvironment()) {
    try {
      const result = await callGasFunction("addItem", itemData);
      if (result && result.success) {
        return { success: true, data: result.data, isMock: false };
      }
      throw new Error(result?.error || "Failed to add item to sheet");
    } catch (err) {
      console.error("Failed to add item in GAS:", err);
      throw err;
    }
  }

  // Local development mock mutation
  console.log("⚡ [Local Dev] Adding item to local mock store:", itemData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = {
        ...itemData,
        ID: itemData.ID || `ITEM-${Date.now().toString().slice(-4)}`,
        Date: itemData.Date || new Date().toISOString().split("T")[0],
      };
      localMockItems = [newItem, ...localMockItems];
      resolve({
        success: true,
        data: newItem,
        isMock: true,
      });
    }, 350);
  });
}

/**
 * Get spreadsheet metadata and environment details
 */
export async function getAppInfo() {
  if (isGasEnvironment()) {
    try {
      const result = await callGasFunction("getAppInfo");
      if (result && result.success) {
        return { success: true, data: result.data, isMock: false };
      }
    } catch (err) {
      console.warn("Could not retrieve app info from GAS:", err);
    }
  }

  return {
    success: true,
    data: {
      ...MOCK_APP_INFO,
      totalRows: localMockItems.length,
    },
    isMock: true,
  };
}
