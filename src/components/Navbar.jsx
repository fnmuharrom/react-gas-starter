import React from "react";
import { Database, RefreshCw, Plus, Sheet } from "lucide-react";

export function Navbar({ isGas, onRefresh, isLoading, onOpenAddModal }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <Sheet size={22} />
          </div>
          <div className="brand-info">
            <h1>React GAS Starter</h1>
            <p>Google Sheets & React Integration</p>
          </div>
        </div>

        <div className="nav-actions">
          <div
            className={`env-badge ${isGas ? "gas" : "mock"}`}
            title={
              isGas
                ? "Running live inside Google Apps Script"
                : "Running in local browser with simulated Google Sheet mock data"
            }
          >
            <span className="env-indicator"></span>
            <span>{isGas ? "GAS Production" : "Local Mock Mode"}</span>
          </div>

          <button
            className="btn-icon"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Sheet Data"
          >
            <RefreshCw
              size={18}
              className={isLoading ? "spin-icon" : ""}
            />
          </button>

          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </header>
  );
}
