import React, { useState } from 'react';
// useImmer works just like useState but gives you a "draft" (a mutable proxy)
// so you can update deeply nested state as if you were mutating it directly —
// Immer handles producing the new immutable state behind the scenes.
import { useImmer } from 'use-immer';

// ─── constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Beverages', 'Snacks', 'Other'];

const EMPTY_FORM = {
  name: '',
  quantity: '',
  category: CATEGORIES[0],
  notes: '',
};

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 760,
    margin: '0 auto',
    padding: '24px 16px',
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1a202c',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#2d3748',
    marginTop: 0,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '2px solid #e2e8f0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#4a5568',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e0',
    fontSize: 14,
    color: '#2d3748',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e0',
    fontSize: 14,
    color: '#2d3748',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e0',
    fontSize: 14,
    color: '#2d3748',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: 70,
  },
  errorText: {
    fontSize: 12,
    color: '#e53e3e',
    marginTop: 3,
  },
  buttonRow: {
    display: 'flex',
    gap: 8,
    marginTop: 16,
  },
  btnPrimary: {
    padding: '9px 20px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#4299e1',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSuccess: {
    padding: '9px 20px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#48bb78',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '9px 20px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e0',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '32px 0',
    fontSize: 15,
  },
  itemCard: {
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#f7fafc',
    transition: 'box-shadow 0.2s',
  },
  itemCardEditing: {
    border: '1.5px solid #4299e1',
    backgroundColor: '#ebf8ff',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2d3748',
    margin: '0 0 4px',
  },
  itemMeta: {
    fontSize: 13,
    color: '#718096',
    margin: '2px 0',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 99,
    backgroundColor: '#bee3f8',
    color: '#2b6cb0',
    fontSize: 12,
    fontWeight: 600,
    marginRight: 8,
  },
  itemActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
    marginLeft: 12,
  },
  btnEdit: {
    padding: '6px 14px',
    borderRadius: 7,
    border: 'none',
    backgroundColor: '#ecc94b',
    color: '#744210',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDelete: {
    padding: '6px 14px',
    borderRadius: 7,
    border: 'none',
    backgroundColor: '#fc8181',
    color: '#742a2a',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  counter: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'right',
    marginBottom: 12,
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function ShoppingListWithImmer() {
  // useImmer replaces useState for the shopping list.
  // Instead of spreading / cloning objects to update nested fields,
  // we mutate the `draft` directly and Immer produces the next immutable state.
  const [items, updateItems] = useImmer([]);

  // Regular useState is fine for ephemeral UI state like form values.
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null); // id of item being edited

  // ── validation ─────────────────────────────────────────────────────────────

  function validate(values) {
    const errs = {};
    if (!values.name.trim()) {
      errs.name = 'Name is required.';
    }
    const qty = Number(values.quantity);
    if (values.quantity === '' || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      errs.quantity = 'Quantity must be a positive whole number.';
    }
    return errs;
  }

  // ── form helpers ───────────────────────────────────────────────────────────

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
  }

  // ── A. Add Item ────────────────────────────────────────────────────────────

  function handleAdd() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // useImmer: we push directly onto the draft array — no spread/concat needed.
    updateItems((draft) => {
      draft.push({
        id: Date.now(),
        name: form.name.trim(),
        quantity: Number(form.quantity),
        details: {
          category: form.category,
          notes: form.notes.trim(),
        },
      });
    });

    resetForm();
  }

  // ── B. Start Editing ───────────────────────────────────────────────────────

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: String(item.quantity),
      category: item.details.category,
      notes: item.details.notes,
    });
    setErrors({});
  }

  // ── B. Save Edited Item ────────────────────────────────────────────────────

  function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // useImmer: find the item in the draft and mutate its fields directly.
    // With plain useState you would need to map/spread every level.
    updateItems((draft) => {
      const item = draft.find((i) => i.id === editingId);
      if (item) {
        item.name = form.name.trim();
        item.quantity = Number(form.quantity);
        // Nested update — Immer handles immutability automatically
        item.details.category = form.category;
        item.details.notes = form.notes.trim();
      }
    });

    resetForm();
  }

  // ── C. Remove Item ─────────────────────────────────────────────────────────

  function handleDelete(id) {
    // useImmer: splice the draft array directly — no filter/spread needed.
    updateItems((draft) => {
      const index = draft.findIndex((i) => i.id === id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });

    // If we were editing the deleted item, reset the form
    if (editingId === id) {
      resetForm();
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  const isEditing = editingId !== null;

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🛒 Shopping List</h1>
        <p style={styles.subtitle}>State management powered by useImmer</p>
      </div>

      {/* ── Form Section ─────────────────────────────────────────────────── */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          {isEditing ? '✏️ Edit Item' : '➕ Add New Item'}
        </h2>

        <div style={styles.formGrid}>
          {/* Name */}
          <div>
            <label style={styles.label} htmlFor="name">Item Name</label>
            <input
              id="name"
              name="name"
              style={styles.input}
              type="text"
              placeholder="e.g. Organic Milk"
              value={form.name}
              onChange={handleFormChange}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label style={styles.label} htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              style={styles.input}
              type="number"
              min="1"
              placeholder="e.g. 2"
              value={form.quantity}
              onChange={handleFormChange}
            />
            {errors.quantity && <p style={styles.errorText}>{errors.quantity}</p>}
          </div>

          {/* Category */}
          <div>
            <label style={styles.label} htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              style={styles.select}
              value={form.category}
              onChange={handleFormChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={styles.label} htmlFor="notes">Notes</label>
            <input
              id="notes"
              name="notes"
              style={styles.input}
              type="text"
              placeholder="e.g. Low-fat, 2% preferred"
              value={form.notes}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonRow}>
          {isEditing ? (
            <>
              <button style={styles.btnSuccess} onClick={handleSave}>
                💾 Save
              </button>
              <button style={styles.btnSecondary} onClick={resetForm}>
                ✕ Cancel
              </button>
            </>
          ) : (
            <button style={styles.btnPrimary} onClick={handleAdd}>
              + Add Item
            </button>
          )}
        </div>
      </div>

      {/* ── List Section ─────────────────────────────────────────────────── */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📋 Shopping List</h2>

        {items.length > 0 && (
          <p style={styles.counter}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        )}

        {items.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Your list is empty.</p>
            <p>Add your first item using the form above.</p>
          </div>
        ) : (
          items.map((item) => {
            const isThisEditing = item.id === editingId;
            return (
              <div
                key={item.id}
                style={{
                  ...styles.itemCard,
                  ...(isThisEditing ? styles.itemCardEditing : {}),
                }}
              >
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemMeta}>
                    <span style={styles.badge}>{item.details.category}</span>
                    Qty: <strong>{item.quantity}</strong>
                  </p>
                  {item.details.notes && (
                    <p style={styles.itemMeta}>📝 {item.details.notes}</p>
                  )}
                </div>

                <div style={styles.itemActions}>
                  {!isThisEditing && (
                    <button style={styles.btnEdit} onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                  )}
                  <button style={styles.btnDelete} onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
