# Shopping List With Immer

A beginner-friendly React application that demonstrates advanced state management using the **useImmer** hook from the [use-immer](https://github.com/immerjs/use-immer) library.

The key insight: Immer lets you **mutate a draft** of your state directly instead of manually spreading and cloning nested objects — making complex state updates readable and less error-prone.

---

## Features

- **Add items** — Fill in a name, quantity, category, and optional notes, then press *Add Item*
- **Edit items** — Click *Edit* on any row to populate the form; press *Save* to apply changes or *Cancel* to discard
- **Delete items** — Remove any item instantly with the *Delete* button
- **Validation** — Name cannot be empty; quantity must be a positive whole number
- **Nested state** — Each item's `details` object (`category`, `notes`) is updated directly via Immer draft mutations
- **Clean UI** — Inline CSS only; no extra dependencies

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI library (functional components) |
| [Vite 4](https://vitejs.dev/) | Build tool & dev server |
| [use-immer](https://github.com/immerjs/use-immer) | Immutable state with mutable draft API |

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/yisakor-mirany/shopping-list-with-immer.git
cd shopping-list-with-immer

# 2. Install dependencies
npm install
```

---

## Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

Other available scripts:

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

---

## Project Structure

```
shopping-list-with-immer/
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite + React plugin config
├── package.json
└── src/
    ├── main.jsx                    # ReactDOM.createRoot entry
    ├── App.jsx                     # Root component — renders ShoppingListWithImmer
    └── ShoppingListWithImmer.jsx   # Main component (all logic + UI)
```

---

## How useImmer Works (Key Concept)

```jsx
// Plain useState — nested update is verbose
setItems(prev =>
  prev.map(item =>
    item.id === id
      ? { ...item, quantity: 5, details: { ...item.details, category: 'Dairy' } }
      : item
  )
);

// useImmer — mutate the draft directly; Immer handles immutability
updateItems(draft => {
  const item = draft.find(i => i.id === id);
  item.quantity = 5;
  item.details.category = 'Dairy'; // nested update, no spreading
});
```

---

## Example Data Structure

Each item in the `items` array follows this shape:

```js
{
  id: 1713600000000,       // Date.now() — unique timestamp ID
  name: "Organic Milk",
  quantity: 2,
  details: {
    category: "Dairy",
    notes: "Low-fat, 2% preferred"
  }
}
```

Full state snapshot example:

```js
[
  {
    id: 1713600000001,
    name: "Sourdough Bread",
    quantity: 1,
    details: { category: "Bakery", notes: "From the corner bakery" }
  },
  {
    id: 1713600000002,
    name: "Chicken Breast",
    quantity: 3,
    details: { category: "Meat", notes: "Boneless, skinless" }
  },
  {
    id: 1713600000003,
    name: "Orange Juice",
    quantity: 2,
    details: { category: "Beverages", notes: "" }
  }
]
```

---

## Test Cases

### Normal Cases

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 1 | **Add a valid item** | Name: "Eggs", Qty: 12, Category: "Dairy", Notes: "" | Item appears in the list with correct values |
| 2 | **Edit an existing item** | Select "Eggs", change Qty to 6, press Save | List reflects updated quantity of 6 |
| 3 | **Delete an item** | Click Delete on any item | Item is immediately removed from the list |

### Edge Cases

| # | Scenario | What to do | Expected Result |
|---|----------|-----------|-----------------|
| 1 | **Empty name** | Leave name blank, click Add | Error: *"Name is required."* — item not added |
| 2 | **Zero or negative quantity** | Enter 0 or -3 in Qty, click Add | Error: *"Quantity must be a positive whole number."* — item not added |
| 3 | **Non-integer quantity** | Enter 1.5 in Qty, click Add | Error: *"Quantity must be a positive whole number."* — fractional quantities are rejected |
| 4 | **Delete the item being edited** | Start editing item X, then click its Delete button | Item is deleted and the form resets to Add mode |
| 5 | **Edit then Cancel** | Start editing, change name, click Cancel | Original item is unchanged; form clears |
| 6 | **Add item with only whitespace name** | Name: "   ", Qty: 1, click Add | Error: *"Name is required."* — whitespace-only names are rejected |

---

## License

MIT
