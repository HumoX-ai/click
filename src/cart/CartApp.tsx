import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { CartList } from "./CartList";
import { ThemeToggle } from "./ThemeToggle";
import { readCart, writeCart } from "./storage";
import type { CartItem } from "./types";

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CartApp() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(items);

    window.dispatchEvent(
      new CustomEvent<CartItem[]>("mm:cart:changed", {
        detail: items,
      })
    );
  }, [items]);

  useEffect(() => {
    const handler = (ev: Event) => {
      const custom = ev as CustomEvent<CartItem[]>;
      if (Array.isArray(custom.detail)) {
        setItems(custom.detail);
      } else {
        setItems(readCart());
      }
    };

    window.addEventListener("mm:cart:changed", handler);
    return () => window.removeEventListener("mm:cart:changed", handler);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const onRemove = (id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const onClear = () => {
    setItems([]);
  };

  return (
    <div>
      <div className="mm-panel-header">
        <h2 className="mm-panel-title">Savat</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeToggle />
        </div>
      </div>

      <div className="mm-cart-summary">
        <div className="mm-cart-summary-row">
          <div>
            <div className="mm-cart-kpi">Mahsulotlar</div>
            <div className="mm-cart-kpi-value">{totalCount}</div>
          </div>
          <div>
            <div className="mm-cart-kpi">Jami</div>
            <div className="mm-cart-kpi-value">{formatUSD(totalAmount)}</div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={items.length === 0}
          >
            Tozalash
          </Button>
        </div>
      </div>

      <CartList items={items} onRemove={onRemove} />
    </div>
  );
}
