import React, { useState } from 'react';
// useImmer works just like useState but gives you a "draft" (a mutable proxy)
// so you can update deeply nested state as if you were mutating it directly —
// Immer handles producing the new immutable state behind the scenes.
import { useImmer } from 'use-immer';

// ─── constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Beverages', 'Snacks', 'Other'];

// Color accent per category — drives the left border and badge color on each item
const CATEGORY_COLORS = {
  Produce:   { border: '#22c55e', bg: '#dcfce7', text: '#15803d' },
  Dairy:     { border: '#3b82f6', bg: '#dbeafe', text: '#1d4ed8' },
  Bakery:    { border: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
  Meat:      { border: '#ef4444', bg: '#fee2e2', text: '#b91c1c' },
  Frozen:    { border: '#06b6d4', bg: '#cffafe', text: '#0e7490' },
  Beverages: { border: '#a855f7', bg: '#f3e8ff', text: '#7e22ce' },
  Snacks:    { border: '#f97316', bg: '#ffedd5', text: '#c2410c' },
  Other:     { border: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
};

const EMPTY_FORM = {
  name: '',
  quantity: '',
  category: CATEGORIES[0],
  notes: '',
};

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  page: {
    maxWidth: 740,
    margin: '0 auto',
    padding: '32px 16px 48px',
    minHeight: '100vh',
  },

  // ── Header
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: 20,
    padding: '36px 32px',
    marginBottom: 28,
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(79,70,229,0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    pointerEvents: 'none',
  },
  headerGlow2: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    pointerEvents: 'none',
  },
  headerIcon: {
    fontSize: 42,
    display: 'block',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 6px',
    letterSpacing: '-0.5px',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    margin: 0,
  },

  // ── Cards
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '24px 24px',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
    marginBottom: 20,
  },
  cardAccent: {
    borderTop: '3px solid #6366f1',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  // ── Form
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  formGroup: {},
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  buttonRow: {
    display: 'flex',
    gap: 8,
    marginTop: 20,
  },

  // ── List header row
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listCount: {
    background: '#6366f1',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 99,
  },

  // ── Item card
  itemCard: {
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    border: '1.5px solid #f1f5f9',
    borderLeft: '4px solid #94a3b8',
    boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
  },
  itemCardEditing: {
    border: '1.5px solid #6366f1',
    borderLeft: '4px solid #6366f1',
    background: '#fafafe',
    boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
  },
  itemLeft: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.03em',
  },
  qtyPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 12,
    color: '#64748b',
    fontWeight: 500,
  },
  noteText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 360,
  },
  itemActions: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
    marginLeft: 12,
  },

  // ── Empty state
  emptyState: {
    textAlign: 'center',
    padding: '48px 0 32px',
  },
  emptyIcon: {
    fontSize: 48,
    display: 'block',
    marginBottom: 12,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#cbd5e1',
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
  const [editingId, setEditingId] = useState(null);

  // ── validation ─────────────────────────────────────────────────────────────

  function validate(values) {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required.';
    const qty = Number(values.quantity);
    if (values.quantity === '' || isNaN(qty) || qty <= 0 || !Number.isInteger(qty))
      errs.quantity = 'Must be a positive whole number.';
    return errs;
  }

  // ── form helpers ───────────────────────────────────────────────────────────

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
  }

  // ── A. Add Item ────────────────────────────────────────────────────────────

  function handleAdd() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // useImmer: push directly onto the draft — no spread/concat needed
    updateItems((draft) => {
      draft.push({
        id: Date.now(),
        name: form.name.trim(),
        quantity: Number(form.quantity),
        details: { category: form.category, notes: form.notes.trim() },
      });
    });
    resetForm();
  }

  // ── B. Edit / Save ─────────────────────────────────────────────────────────

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

  function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // useImmer: mutate nested fields directly — no map/spread at every level
    updateItems((draft) => {
      const item = draft.find((i) => i.id === editingId);
      if (item) {
        item.name              = form.name.trim();
        item.quantity          = Number(form.quantity);
        item.details.category  = form.category;   // nested — Immer handles it
        item.details.notes     = form.notes.trim();
      }
    });
    resetForm();
  }

  // ── C. Delete Item ─────────────────────────────────────────────────────────

  function handleDelete(id) {
    // useImmer: splice draft directly — no filter/spread needed
    updateItems((draft) => {
      const idx = draft.findIndex((i) => i.id === id);
      if (idx !== -1) draft.splice(idx, 1);
    });
    if (editingId === id) resetForm();
  }

  // ── render ─────────────────────────────────────────────────────────────────

  const isEditing = editingId !== null;

  return (
    <div style={s.page}>

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.headerGlow2} />
        <span style={s.headerIcon}>🛒</span>
        <h1 style={s.headerTitle}>Shopping List</h1>
        <p style={s.headerSub}>Nested state made simple with useImmer</p>
      </div>

      {/* ── Form Card ────────────────────────────────────────────────────── */}
      <div style={{ ...s.card, ...s.cardAccent }}>
        <h2 style={s.sectionTitle}>
          {isEditing ? <>✏️ Edit Item</> : <>➕ New Item</>}
        </h2>

        <div style={s.formGrid}>
          {/* Name */}
          <div style={s.formGroup}>
            <label style={s.label} htmlFor="name">Item Name</label>
            <input
              id="name"
              name="name"
              className={`sl-input${errors.name ? ' error' : ''}`}
              type="text"
              placeholder="e.g. Organic Milk"
              value={form.name}
              onChange={handleFormChange}
            />
            {errors.name && <p style={s.errorText}>⚠ {errors.name}</p>}
          </div>

          {/* Quantity */}
          <div style={s.formGroup}>
            <label style={s.label} htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              className={`sl-input${errors.quantity ? ' error' : ''}`}
              type="number"
              min="1"
              placeholder="e.g. 2"
              value={form.quantity}
              onChange={handleFormChange}
            />
            {errors.quantity && <p style={s.errorText}>⚠ {errors.quantity}</p>}
          </div>

          {/* Category */}
          <div style={s.formGroup}>
            <label style={s.label} htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="sl-select"
              value={form.category}
              onChange={handleFormChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div style={s.formGroup}>
            <label style={s.label} htmlFor="notes">Notes <span style={{ color: '#cbd5e1', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="notes"
              name="notes"
              className="sl-input"
              type="text"
              placeholder="e.g. Low-fat preferred"
              value={form.notes}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={s.buttonRow}>
          {isEditing ? (
            <>
              <button className="sl-btn sl-btn-success" onClick={handleSave}>
                💾 Save Changes
              </button>
              <button className="sl-btn sl-btn-ghost" onClick={resetForm}>
                ✕ Cancel
              </button>
            </>
          ) : (
            <button className="sl-btn sl-btn-primary" onClick={handleAdd}>
              + Add to List
            </button>
          )}
        </div>
      </div>

      {/* ── List Card ────────────────────────────────────────────────────── */}
      <div style={s.card}>
        <div style={s.listHeader}>
          <h2 style={{ ...s.sectionTitle, marginBottom: 0 }}>📋 Your List</h2>
          {items.length > 0 && (
            <span style={s.listCount}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div style={s.emptyState}>
            <span style={s.emptyIcon}>🧺</span>
            <p style={s.emptyTitle}>Your list is empty</p>
            <p style={s.emptyDesc}>Add your first item using the form above</p>
          </div>
        ) : (
          items.map((item) => {
            const isThisEditing = item.id === editingId;
            const color = CATEGORY_COLORS[item.details.category] || CATEGORY_COLORS.Other;

            return (
              <div
                key={item.id}
                className="sl-item-card sl-item-enter"
                style={{
                  ...s.itemCard,
                  borderLeftColor: color.border,
                  ...(isThisEditing ? s.itemCardEditing : {}),
                }}
              >
                {/* Info */}
                <div style={s.itemLeft}>
                  <p style={s.itemName}>{item.name}</p>
                  <div style={s.itemMetaRow}>
                    <span
                      style={{
                        ...s.badge,
                        background: color.bg,
                        color: color.text,
                      }}
                    >
                      {item.details.category}
                    </span>
                    <span style={s.qtyPill}>
                      ×&nbsp;<strong>{item.quantity}</strong>
                    </span>
                  </div>
                  {item.details.notes && (
                    <p style={s.noteText}>📝 {item.details.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div style={s.itemActions}>
                  {!isThisEditing && (
                    <button
                      className="sl-btn sl-btn-edit"
                      style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="sl-btn sl-btn-delete"
                    style={{ padding: '6px 14px', fontSize: 13 }}
                    onClick={() => handleDelete(item.id)}
                  >
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
