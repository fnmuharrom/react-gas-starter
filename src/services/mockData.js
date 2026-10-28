/**
 * Mock data for local browser development and testing
 * Mirrors the structure of Google Sheet rows
 */

export const INITIAL_MOCK_ITEMS = [
  {
    ID: "ITEM-001",
    Title: "Ergonomic Office Chair",
    Category: "Office Supplies",
    Status: "In Stock",
    Quantity: 15,
    Amount: 1750000,
    Date: "2026-03-01",
    Notes: "High back mesh chair with lumbar support",
  },
  {
    ID: "ITEM-002",
    Title: "Mechanical Keyboard 75%",
    Category: "Hardware",
    Status: "In Stock",
    Quantity: 24,
    Amount: 1200000,
    Date: "2026-03-02",
    Notes: "Hot-swappable switches, wireless connection",
  },
  {
    ID: "ITEM-003",
    Title: "Ultra-wide Monitor 34\"",
    Category: "Hardware",
    Status: "Low Stock",
    Quantity: 4,
    Amount: 5600000,
    Date: "2026-03-03",
    Notes: "IPS curved display with USB-C Hub",
  },
  {
    ID: "ITEM-004",
    Title: "Standing Desk Frame",
    Category: "Office Supplies",
    Status: "Out of Stock",
    Quantity: 0,
    Amount: 3200000,
    Date: "2026-03-04",
    Notes: "Dual motor adjustable desk",
  },
  {
    ID: "ITEM-005",
    Title: "USB-C Docking Station",
    Category: "Accessories",
    Status: "In Stock",
    Quantity: 35,
    Amount: 850000,
    Date: "2026-03-05",
    Notes: "10-in-1 multi-port adapter",
  },
  {
    ID: "ITEM-006",
    Title: "Noise-Cancelling Headset",
    Category: "Accessories",
    Status: "In Stock",
    Quantity: 18,
    Amount: 1450000,
    Date: "2026-03-06",
    Notes: "Bluetooth 5.3 with boom mic",
  },
  {
    ID: "ITEM-007",
    Title: "Desk Mat Felt & Leather",
    Category: "Accessories",
    Status: "In Stock",
    Quantity: 50,
    Amount: 220000,
    Date: "2026-03-07",
    Notes: "Water resistant, 90x40cm",
  },
];

export const MOCK_APP_INFO = {
  spreadsheetName: "Inventory Master Sheet (Mock Local)",
  sheetName: "Data",
  totalRows: INITIAL_MOCK_ITEMS.length,
  timezone: "Asia/Jakarta",
  userEmail: "developer@localhost",
};
