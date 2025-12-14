import type { CartItem as CartItemType } from "./types";
import { CartItem } from "./CartItem";

type Props = {
  items: CartItemType[];
  onRemove: (id: number) => void;
};

export function CartList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return <div className="mm-empty">Savat bo'sh.</div>;
  }

  return (
    <div className="mm-cart-list">
      {items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}
