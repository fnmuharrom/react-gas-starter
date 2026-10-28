import React from "react";
import { Package, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";

export function StatsOverview({ items = [] }) {
  const totalItems = items.length;

  const totalValue = items.reduce((acc, curr) => {
    const val = Number(curr.Amount || 0);
    const qty = Number(curr.Quantity || 1);
    return acc + val * qty;
  }, 0);

  const inStockCount = items.filter(
    (item) => item.Status?.toLowerCase() === "in stock"
  ).length;

  const attentionCount = items.filter(
    (item) =>
      item.Status?.toLowerCase() === "low stock" ||
      item.Status?.toLowerCase() === "out of stock"
  ).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper blue">
          <Package size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">Total Sheet Records</div>
          <div className="stat-value">{totalItems}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper green">
          <DollarSign size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">Total Asset Value</div>
          <div className="stat-value">{formatCurrency(totalValue)}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper purple">
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">In Stock Items</div>
          <div className="stat-value">{inStockCount}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper amber">
          <AlertTriangle size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">Low / Out of Stock</div>
          <div className="stat-value">{attentionCount}</div>
        </div>
      </div>
    </div>
  );
}
