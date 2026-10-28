import React from "react";
import { Search, LayoutGrid, List, X } from "lucide-react";

export function FilterBar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  statuses,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onReset,
}) {
  const isFiltered = searchTerm || selectedCategory || selectedStatus;

  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by ID, title, or notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            className="btn btn-outline"
            onClick={onReset}
            title="Reset Filters"
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        )}

        <div className="view-toggle">
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => onViewModeChange("table")}
            title="Table View"
          >
            <List size={18} />
          </button>
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => onViewModeChange("grid")}
            title="Grid Cards View"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
