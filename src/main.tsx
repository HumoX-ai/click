import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "./marketplace.css";
import { initProducts } from "./products";
import { ThemeProvider } from "./components/theme-provider";
import { CartApp } from "./cart/CartApp";

initProducts();

const cartRoot = document.getElementById("cart-root");
if (cartRoot) {
  createRoot(cartRoot).render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="mm-theme">
        <CartApp />
      </ThemeProvider>
    </StrictMode>
  );
}
