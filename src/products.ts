type ApiProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export type CartItem = ApiProduct & { quantity: number };

const CART_STORAGE_KEY = "mm-cart";
const API_URL = "https://fakestoreapi.com/products";

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readCart(): CartItem[] {
  return safeParseJson<CartItem[]>(localStorage.getItem(CART_STORAGE_KEY), []);
}

function writeCart(cart: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  console.log("products writeCart:", cart);
}

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function setLoading(root: HTMLElement) {
  root.innerHTML = `
    <div class="mm-products">
      <div class="mm-muted">Mahsulotlar yuklanmoqda…</div>
    </div>
  `.trim();
}

function setError(root: HTMLElement, message: string) {
  root.innerHTML = `
    <div class="mm-error">${message}</div>
  `.trim();
}

function renderProducts(root: HTMLElement, products: ApiProduct[]) {
  const wrapper = document.createElement("div");
  wrapper.className = "mm-products";

  const grid = document.createElement("div");
  grid.className = "mm-products-grid";

  const byId = new Map<number, ApiProduct>();

  for (const product of products) {
    byId.set(product.id, product);

    const card = document.createElement("article");
    card.className = "mm-product-card";

    const media = document.createElement("div");
    media.className = "mm-product-media";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = product.title;
    img.src = product.image;

    media.appendChild(img);

    const body = document.createElement("div");
    body.className = "mm-product-body";

    const title = document.createElement("h3");
    title.className = "mm-product-title";
    title.textContent = product.title;

    const row = document.createElement("div");
    row.className = "mm-product-row";

    const price = document.createElement("div");
    price.className = "mm-price";
    price.textContent = formatUSD(product.price);

    const btn = document.createElement("button");
    btn.className = "mm-btn mm-btn--primary";
    btn.type = "button";
    btn.dataset.action = "add-to-cart";
    btn.dataset.productId = String(product.id);
    btn.textContent = "Savatga qo'shish";

    row.appendChild(price);
    row.appendChild(btn);

    body.appendChild(title);
    body.appendChild(row);

    card.appendChild(media);
    card.appendChild(body);

    grid.appendChild(card);
  }

  wrapper.appendChild(grid);
  root.replaceChildren(wrapper);

  root.addEventListener("click", (ev) => {
    const target = ev.target as HTMLElement | null;
    const button = target?.closest(
      'button[data-action="add-to-cart"]'
    ) as HTMLButtonElement | null;

    if (!button) return;

    const id = Number(button.dataset.productId);
    const product = byId.get(id);
    if (!product) return;

    const cart = readCart();
    const existing = cart.find((c) => c.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    writeCart(cart);

    window.dispatchEvent(
      new CustomEvent<CartItem[]>("mm:cart:changed", {
        detail: cart,
      })
    );
  });
}

export async function initProducts() {
  const root = document.getElementById("products-root");
  if (!root) return;

  setLoading(root);

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }

    const products = (await res.json()) as ApiProduct[];
    renderProducts(root, products);
  } catch {
    setError(
      root,
      "Mahsulotlarni yuklashda xatolik yuz berdi. Iltimos, sahifani qayta yuklang va yana urinib ko'ring."
    );
  }
}
