import { products } from './products.js';
import { getCart, getCartTotal, getTotalItems } from './cart.js';

// ── DOM REFERENCES ───────────────────────────────────────────────
const productsGrid   = document.getElementById('productsGrid');
const cartSummaryEl  = document.getElementById('cartSummary');
const subtotalEl     = document.getElementById('subtotal');
const totalDisplayEl = document.getElementById('totalDisplay');
const payModal       = document.getElementById('payModal');
const modalTotalEl   = document.getElementById('modalTotal');
const toastEl        = document.getElementById('toast');

export const cartOverlay  = document.getElementById('cartOverlay');
export const cartItemsEl  = document.getElementById('cartItems');
export const cartBadge    = document.getElementById('cartBadge');

// ── PRODUCTS ─────────────────────────────────────────────────────
export function renderProducts() {
  productsGrid.innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <div class="card-tag">${p.tag}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <span class="card-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" data-id="${p.id}">+ Agregar</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── CART ─────────────────────────────────────────────────────────
export function renderCart() {
  const items = Object.values(getCart());

  if (items.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <span>🛍️</span>
        Tu carrito está vacío.<br>Agrega productos para continuar.
      </div>`;
    cartSummaryEl.style.display = 'none';
    return;
  }

  cartItemsEl.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
        <button class="remove-btn" data-action="remove" data-id="${item.id}" title="Eliminar">🗑</button>
      </div>
    </div>
  `).join('');

  const total = getCartTotal();
  subtotalEl.textContent     = `$${total.toFixed(2)}`;
  totalDisplayEl.textContent = `$${total.toFixed(2)}`;
  cartSummaryEl.style.display = 'block';
}

export function updateBadge() {
  const count = getTotalItems();
  cartBadge.textContent   = count;
  cartBadge.style.display = count > 0 ? 'flex' : 'none';
}

// ── CART PANEL ───────────────────────────────────────────────────
export function openCart()  { cartOverlay.classList.add('open'); renderCart(); }
export function closeCart() { cartOverlay.classList.remove('open'); }
export function toggleCart() {
  cartOverlay.classList.contains('open') ? closeCart() : openCart();
}

// ── PAYMENT MODAL ────────────────────────────────────────────────
export function openPayModal() {
  modalTotalEl.textContent = `$${getCartTotal().toFixed(2)}`;
  payModal.classList.add('open');
}

export function closePayModal() {
  payModal.classList.remove('open');
}

// ── TOAST ─────────────────────────────────────────────────────────
export function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2800);
}
