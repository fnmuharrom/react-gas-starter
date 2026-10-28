import React from "react";
import { X, Calendar, Tag, Package, DollarSign, Layers } from "lucide-react";

export function ItemDetailModal({ item, onClose }) {
  if (!item) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val) || 0);
  };

  const totalValue = (Number(item.Quantity) || 0) * (Number(item.Amount) || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Item Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: "0.5rem" }}>
            <span className="item-id">{item.ID}</span>
            <h3 style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
              {item.Title}
            </h3>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <Tag size={14} style={{ display: "inline", marginRight: "6px" }} />
              Category
            </span>
            <span className="detail-value">{item.Category || "-"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <Layers size={14} style={{ display: "inline", marginRight: "6px" }} />
              Status
            </span>
            <span className="detail-value">{item.Status || "-"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <Package size={14} style={{ display: "inline", marginRight: "6px" }} />
              Quantity In Stock
            </span>
            <span className="detail-value">{item.Quantity ?? 0}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <DollarSign size={14} style={{ display: "inline", marginRight: "6px" }} />
              Unit Price
            </span>
            <span className="detail-value">{formatCurrency(item.Amount)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <DollarSign size={14} style={{ display: "inline", marginRight: "6px" }} />
              Calculated Total Value
            </span>
            <span className="detail-value" style={{ color: "var(--primary)" }}>
              {formatCurrency(totalValue)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <Calendar size={14} style={{ display: "inline", marginRight: "6px" }} />
              Recorded Date
            </span>
            <span className="detail-value">{item.Date || "-"}</span>
          </div>

          {item.Notes && (
            <div style={{ marginTop: "0.5rem" }}>
              <div className="detail-label" style={{ marginBottom: "0.25rem" }}>
                Notes / Description:
              </div>
              <div
                style={{
                  background: "var(--bg-subtle)",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                {item.Notes}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
