'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { lineKey } from '@/lib/order';

const STORAGE_KEY = 'petpuja.cart.v1';
// Set when the guest arrives through a table QR code, so checkout can default
// to dine-in and the kitchen ticket says which table to walk the tray to.
const TABLE_KEY = 'petpuja.table.v1';

const CartContext = createContext(null);

function reducer(items, action) {
  switch (action.type) {
    case 'hydrate':
      return action.items;

    case 'add': {
      const key = lineKey(action.item.kind, action.item.id);
      const existing = items.find((i) => i.key === key);
      if (existing) {
        return items.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...items, { ...action.item, key, qty: 1 }];
    }

    case 'setQty': {
      if (action.qty <= 0) return items.filter((i) => i.key !== action.key);
      return items.map((i) => (i.key === action.key ? { ...i, qty: action.qty } : i));
    }

    case 'remove':
      return items.filter((i) => i.key !== action.key);

    case 'clear':
      return [];

    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [table, setTableState] = useState('');
  // Guards the first render: we must not write an empty cart over a stored one.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: 'hydrate', items: parsed });
      }
      const storedTable = localStorage.getItem(TABLE_KEY);
      if (storedTable) setTableState(storedTable);
    } catch {
      // A corrupt or unavailable store just means we start empty.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode / quota — the cart still works for this session.
    }
  }, [items, ready]);

  // Lock the page behind the drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const setTable = (next) => {
    const clean = String(next ?? '').trim().slice(0, 8);
    setTableState(clean);
    try {
      if (clean) localStorage.setItem(TABLE_KEY, clean);
      else localStorage.removeItem(TABLE_KEY);
    } catch {
      // Session-only is good enough.
    }
  };

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    return {
      items,
      count,
      ready,
      open,
      table,
      setTable,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add: (item) => {
        dispatch({ type: 'add', item });
      },
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      qtyOf: (kind, id) => items.find((i) => i.key === lineKey(kind, id))?.qty ?? 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, open, ready, table]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
