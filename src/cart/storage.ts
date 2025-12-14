import type { CartItem } from "./types";

export const CART_STORAGE_KEY = "mm-cart";

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readCart(): CartItem[] {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  console.log("readCart raw:", raw);
  const parsed = safeParseJson<CartItem[]>(raw, []);
  console.log("readCart parsed:", parsed);
  return parsed;
}

export function writeCart(cart: CartItem[]) {
  console.log("writeCart:", cart);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}
