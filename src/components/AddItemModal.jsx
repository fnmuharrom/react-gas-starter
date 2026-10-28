import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

export function AddItemModal({ isOpen, onClose, onAdd, categories = [] }) {
  const [formData, setFormData] = useState({
    Title: "",
    Category: categories[0] || "Office Supplies",
    Status: "In Stock",
    Quantity: 1,
    Amount: 100000,
    Notes: "",
    Date: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Title.trim()) return;

    try {
      setIsSubmitting(true);
      await onAdd({
        ...formData,
        Quantity: Number(formData.Quantity) || 0,
        Amount: Number(formData.Amount) || 0,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Record</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Title / Item Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Ergonomic Keyboard"
                value={formData.Title}
                onChange={(e) =>
                  setFormData({ ...formData, Title: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  value={formData.Category}
                  onChange={(e) =>
                    setFormData({ ...formData, Category: e.target.value })
                  }
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Hardware">Hardware</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Accessories">Accessories</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-select"
                  value={formData.Status}
                  onChange={(e) =>
                    setFormData({ ...formData, Status: e.target.value })
                  }
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-input"
                  value={formData.Quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, Quantity: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Unit Amount (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  className="form-input"
                  value={formData.Amount}
                  onChange={(e) =>
                    setFormData({ ...formData, Amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.Date}
                onChange={(e) =>
                  setFormData({ ...formData, Date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Notes / Description</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Optional notes..."
                value={formData.Notes}
                onChange={(e) =>
                  setFormData({ ...formData, Notes: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Saving to Sheet...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Save Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
