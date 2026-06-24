// ── PRODUCTS DATA ──────────────────────────────────────────────
const products = [
  { id: 1, emoji: '🥑', name: 'Aguacate Hass',       tag: 'Frutas',   desc: 'Aguacates cremosos cultivados en el campo, listos para consumir.', price: 2.50 },
  { id: 2, emoji: '🍓', name: 'Fresas Premium',       tag: 'Frutas',   desc: 'Fresas dulces y frescas, cosechadas esta mañana.',                 price: 3.99 },
  { id: 3, emoji: '🥦', name: 'Brócoli Orgánico',     tag: 'Verduras', desc: 'Brócoli verde intenso, cultivado sin pesticidas.',                 price: 1.80 },
  { id: 4, emoji: '🍅', name: 'Tomates Cherry',       tag: 'Verduras', desc: 'Pequeños, dulces y perfectos para ensaladas.',                     price: 2.20 },
  { id: 5, emoji: '🫐', name: 'Arándanos Silvestres', tag: 'Frutas',   desc: 'Antioxidantes naturales, llenos de sabor intenso.',                price: 5.50 },
  { id: 6, emoji: '🥕', name: 'Zanahorias Baby',      tag: 'Verduras', desc: 'Tiernas y crujientes, ideales para snacks.',                       price: 1.60 },
  { id: 7, emoji: '🧀', name: 'Queso Artesanal',      tag: 'Lácteos',  desc: 'Queso fresco de leche de vaca, elaborado localmente.',             price: 6.90 },
  { id: 8, emoji: '🍯', name: 'Miel de Abeja Pura',   tag: 'Natural',  desc: '100% natural, sin aditivos, directa del apicultor.',              price: 8.50 },
];

// ── PAYPHONE CREDENCIALES ───────────────────────────────────────
const PAYPHONE_TOKEN = '_VscCS12NaTq8_-JAEKQR9s5bWpr1sKrYoIQ8TBMxUhQcaP2rDGv_zbRvW3H4pyby23GXyL2V2dBjYv9o48aPgam0fWlPleoeNMzWWm7O02WpH3XA2OOb1vXs4zibb0n7L_SAjnEkwxyRjRKW3XNuRIEBkpak-OCBeWYootuSgUc7IkuI-tQqhu5H8rc-DT9k_-5xoV_n9rzrqHCgJpASGHmGrB-KDCNKJHjK-5hAXHqyBBbPnQpqpd5BhaQvR4LpH_-V4sGQaKumKWHRi2yP7VAoW9f26rY5VsLc8NHe1xxIK4_fMX0k24TYx1priNIb5uEdyqgqmmfoKar6qeU2Kszelo';
const PAYPHONE_STORE_ID = 'fd0bf378-a4d8-4d50-bd52-65b1e2181d7a';
const RESPONSE_URL = 'http://127.0.0.1:5500/respuesta.html';

// ── STATE ───────────────────────────────────────────────────────
let cart = {};
let ppb  = null;

// ── DOM REFERENCES ──────────────────────────────────────────────
const productsGrid   = document.getElementById('productsGrid');
const cartOverlay    = document.getElementById('cartOverlay');
const cartItemsEl    = document.getElementById('cartItems');
const cartSummaryEl  = document.getElementById('cartSummary');
const cartBadge      = document.getElementById('cartBadge');
const subtotalEl     = document.getElementById('subtotal');
const totalDisplayEl = document.getElementById('totalDisplay');
const payModal       = document.getElementById('payModal');
const modalTotalEl   = document.getElementById('modalTotal');
const toastEl        = document.getElementById('toast');

// ── RENDER PRODUCTS ─────────────────────────────────────────────
function renderProducts() {
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

  productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (btn) addToCart(Number(btn.dataset.id));
  });
}

// ── CART LOGIC ──────────────────────────────────────────────────
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (!cart[id]) cart[id] = { ...product, qty: 0 };
  cart[id].qty++;
  updateBadge();
  renderCart();
  showToast(`${product.emoji} ${product.name} añadido al carrito`);
}

function removeFromCart(id) {
  delete cart[id];
  updateBadge();
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    removeFromCart(id);
  } else {
    updateBadge();
    renderCart();
  }
}

function getCartTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getTotalItems() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

// ── RENDER CART ─────────────────────────────────────────────────
function renderCart() {
  const items = Object.values(cart);

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
  subtotalEl.textContent      = `$${total.toFixed(2)}`;
  totalDisplayEl.textContent  = `$${total.toFixed(2)}`;
  cartSummaryEl.style.display = 'block';
}

// ── BADGE ────────────────────────────────────────────────────────
function updateBadge() {
  const count = getTotalItems();
  cartBadge.textContent   = count;
  cartBadge.style.display = count > 0 ? 'flex' : 'none';
}

// ── CART PANEL TOGGLE ────────────────────────────────────────────
function openCart()  { cartOverlay.classList.add('open');    renderCart(); }
function closeCart() { cartOverlay.classList.remove('open'); }
function toggleCart() {
  cartOverlay.classList.contains('open') ? closeCart() : openCart();
}

// ── PAYMENT MODAL ────────────────────────────────────────────────
function openPayModal() {
  modalTotalEl.textContent = `$${getCartTotal().toFixed(2)}`;
  payModal.classList.add('open');
}

function closePayModal() {
  payModal.classList.remove('open');
}

// ── PAYPHONE: FUNCIÓN PRINCIPAL DE PAGO (REQUEST) ────────────────
function confirmPayment() {
  const totalDecimal  = getCartTotal();
  const amountInCents = Math.round(totalDecimal * 100);

  if (amountInCents <= 0) {
    showToast('⚠️ El carrito está vacío.');
    return;
  }

  const clientTransactionId = Date.now().toString().slice(-13);
  const reference = Object.values(cart).map(i => i.name).join(', ').slice(0, 100);

  closePayModal();
  closeCart();

  const container = document.getElementById('pp-button');
  container.innerHTML = '';

  ppb = new PPaymentButtonBox({
    token              : PAYPHONE_TOKEN,
    clientTransactionId: clientTransactionId,
    amount             : amountInCents,
    amountWithoutTax   : amountInCents,
    currency           : 'USD',
    storeId            : PAYPHONE_STORE_ID,
    reference          : reference,
    lang               : 'es',
    defaultMethod      : 'card',
  }).render('pp-button');

  document.getElementById('pp-button-wrapper').style.display = 'flex';
  showToast('🔄 Cargando cajita de pago...');
}

// ── CERRAR CAJITA ─────────────────────────────────────────────────
function closePPBox() {
  document.getElementById('pp-button-wrapper').style.display = 'none';
  document.getElementById('pp-button').innerHTML = '';
  ppb = null;
}

// ── TOAST ─────────────────────────────────────────────────────────
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ── EVENT LISTENERS ──────────────────────────────────────────────
document.getElementById('cartToggleBtn').addEventListener('click', toggleCart);
document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
document.getElementById('payBtn').addEventListener('click', openPayModal);
document.getElementById('modalCancelBtn').addEventListener('click', closePayModal);
document.getElementById('modalConfirmBtn').addEventListener('click', confirmPayment);
document.getElementById('ppBoxCloseBtn').addEventListener('click', closePPBox);

cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCart();
});

cartItemsEl.addEventListener('click', (e) => {
  const btn    = e.target.closest('[data-action]');
  if (!btn) return;
  const id     = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === 'increase') changeQty(id, +1);
  if (action === 'decrease') changeQty(id, -1);
  if (action === 'remove')   removeFromCart(id);
});

// ── INIT ──────────────────────────────────────────────────────────
renderProducts();
renderCart();
