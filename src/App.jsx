import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { StatsOverview } from "./components/StatsOverview";
import { FilterBar } from "./components/FilterBar";
import { DataTable } from "./components/DataTable";
import { ItemDetailModal } from "./components/ItemDetailModal";
import { AddItemModal } from "./components/AddItemModal";
import { getItems, addItem, getAppInfo, isGasEnvironment } from "./services/gasApi";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function App() {
  const [items, setItems] = useState([]);
  const [appInfo, setAppInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGas, setIsGas] = useState(false);

  // Filters & display state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Modals state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial data
  const loadData = async (showLoadingState = true) => {
    if (showLoadingState) setIsLoading(true);
    setError(null);

    try {
      const isGasActive = isGasEnvironment();
      setIsGas(isGasActive);

      const [itemsResponse, infoResponse] = await Promise.all([
        getItems(),
        getAppInfo(),
      ]);

      if (itemsResponse.success) {
        setItems(itemsResponse.data);
      }
      if (infoResponse.success) {
        setAppInfo(infoResponse.data);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message || "Failed to load Google Sheet data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    await loadData(true);
    showToast("Refreshed latest data from Google Sheet");
  };

  const handleAddItem = async (newItemData) => {
    try {
      const response = await addItem(newItemData);
      if (response.success) {
        setItems((prev) => [response.data, ...prev]);
        showToast(`Item "${newItemData.Title}" added successfully!`);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to save item", "error");
      throw err;
    }
  };

  // Unique categories & statuses for filter dropdowns
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      if (item.Category) set.add(item.Category);
    });
    return Array.from(set).sort();
  }, [items]);

  const statuses = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      if (item.Status) set.add(item.Status);
    });
    return Array.from(set).sort();
  }, [items]);

  // Filtered dataset
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || item.Category === selectedCategory;

      const matchesStatus = !selectedStatus || item.Status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchTerm, selectedCategory, selectedStatus]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  return (
    <div className="app-container">
      <Navbar
        isGas={isGas}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="main-content">
        {/* Metric Summary Cards */}
        <StatsOverview items={items} />

        {/* Filters and Controls */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          statuses={statuses}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onReset={handleResetFilters}
        />

        {/* Error Notice */}
        {error && (
          <div
            style={{
              padding: "1rem",
              background: "var(--danger-bg)",
              color: "var(--danger)",
              border: "1px solid var(--danger-border)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Content Table / Cards */}
        {isLoading ? (
          <div className="table-container">
            <div className="empty-state">
              <Loader2 size={36} className="spin-icon" style={{ color: "var(--primary)" }} />
              <h3>Connecting to Google Sheet...</h3>
              <p>Fetching latest records from your spreadsheet.</p>
            </div>
          </div>
        ) : (
          <DataTable
            items={filteredItems}
            viewMode={viewMode}
            onSelectItem={setSelectedItem}
          />
        )}
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Add New Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        categories={categories}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          {toast.type === "error" ? (
            <AlertCircle size={18} style={{ color: "#ef4444" }} />
          ) : (
            <CheckCircle size={18} style={{ color: "#10b981" }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* App Footer */}
      <footer className="footer">
        <p>
          React + Google Apps Script Starter •{" "}
          {appInfo ? (
            <span>
              Connected to <strong>{appInfo.spreadsheetName}</strong> (Sheet: {appInfo.sheetName})
            </span>
          ) : (
            "Ready for production deployment"
          )}
        </p>
      </footer>
    </div>
  );
}

export default App;
