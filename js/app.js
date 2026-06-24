import { addToCart, removeFromCart, changeQty, getCartTotal, getCart } from './cart.js';
import { renderPaymentBox, closePaymentBox } from './payphone.js';
import {
  renderProducts, renderCart, updateBadge,
  openCart, closeCart, toggleCart,
  openPayModal, closePayModal,
  showToast,
  cartOverlay, cartItemsEl,
} from './ui.js';

// ── HANDLERS ─────────────────────────────────────────────────────
function handleAddToCart(id) {
  const product = addToCart(id);
  if (!product) return;
  updateBadge();
  renderCart();
  showToast(`${product.emoji} ${product.name} añadido al carrito`);
}

function handleCartItemAction(id, action) {
  if (action === 'increase') changeQty(id, +1);
  if (action === 'decrease') changeQty(id, -1);
  if (action === 'remove')   removeFromCart(id);
  updateBadge();
  renderCart();
}

function handleConfirmPayment() {
  const amountInCents = Math.round(getCartTotal() * 100);
  if (amountInCents <= 0) { showToast('⚠️ El carrito está vacío.'); return; }

  const clientTransactionId = Date.now().toString().slice(-13);
  const reference = Object.values(getCart()).map(i => i.name).join(', ').slice(0, 100);

  closePayModal();
  closeCart();
  renderPaymentBox(amountInCents, clientTransactionId, reference);
  showToast('🔄 Cargando cajita de pago...');
}

// ── EVENT LISTENERS ──────────────────────────────────────────────
document.getElementById('cartToggleBtn').addEventListener('click', toggleCart);
document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
document.getElementById('payBtn').addEventListener('click', openPayModal);
document.getElementById('modalCancelBtn').addEventListener('click', closePayModal);
document.getElementById('modalConfirmBtn').addEventListener('click', handleConfirmPayment);
document.getElementById('ppBoxCloseBtn').addEventListener('click', closePaymentBox);

cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCart();
});

document.getElementById('productsGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if (btn) handleAddToCart(Number(btn.dataset.id));
});

cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  handleCartItemAction(Number(btn.dataset.id), btn.dataset.action);
});

// ── INIT ─────────────────────────────────────────────────────────
renderProducts();
renderCart();
