import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "./types";

type Props = {
  item: CartItemType;
  onRemove: (id: number) => void;
};

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CartItem({ item, onRemove }: Props) {
  return (
    <div className="mm-cart-item">
      <div className="mm-cart-thumb" aria-hidden="true">
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>

      <div className="mm-cart-info">
        <div className="mm-cart-title" title={item.title}>
          {item.title}
        </div>
        <div className="mm-cart-meta">
          <span className="mm-muted">
            {formatUSD(item.price)} × {item.quantity}
          </span>
          <span className="mm-cart-line-total">
            {formatUSD(item.price * item.quantity)}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        aria-label={`Olib tashlash ${item.title}`}
        title="Olib tashlash"
      >
        Olib tashlash
      </Button>
    </div>
  );
}
