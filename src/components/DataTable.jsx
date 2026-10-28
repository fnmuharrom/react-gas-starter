import React from "react";
import { Eye, FileQuestion } from "lucide-react";

export function DataTable({ items = [], viewMode = "table", onSelectItem }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val) || 0);
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("in stock") || s.includes("available")) {
      return <span className="badge badge-instock">{status}</span>;
    }
    if (s.includes("low")) {
      return <span className="badge badge-lowstock">{status}</span>;
    }
    return <span className="badge badge-outofstock">{status}</span>;
  };

  if (items.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <FileQuestion size={44} />
          <h3>No records found</h3>
          <p>Try clearing your search filters or check your Google Sheet connection.</p>
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="cards-grid">
        {items.map((item, idx) => (
          <div
            key={item.ID || idx}
            className="item-card"
            onClick={() => onSelectItem(item)}
          >
            <div>
              <div className="card-header">
                <span className="item-id">{item.ID}</span>
                {getStatusBadge(item.Status)}
              </div>
              <div className="card-body" style={{ marginTop: "0.75rem" }}>
                <h3>{item.Title}</h3>
                <span className="badge badge-category">{item.Category}</span>
                {item.Notes && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {item.Notes}
                  </p>
                )}
              </div>
            </div>

            <div className="card-footer">
              <div>
                <strong>Qty:</strong> {item.Quantity}
              </div>
              <div style={{ fontWeight: 700, color: "var(--primary)" }}>
                {formatCurrency(item.Amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item / Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Unit Amount</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.ID || idx} onClick={() => onSelectItem(item)}>
                <td>
                  <span className="item-id">{item.ID}</span>
                </td>
                <td>
                  <div className="item-title">{item.Title}</div>
                  {item.Notes && <div className="item-notes">{item.Notes}</div>}
                </td>
                <td>
                  <span className="badge badge-category">{item.Category}</span>
                </td>
                <td>{getStatusBadge(item.Status)}</td>
                <td>
                  <strong>{item.Quantity}</strong>
                </td>
                <td>{formatCurrency(item.Amount)}</td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                  {item.Date}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn-icon"
                    title="View details"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
