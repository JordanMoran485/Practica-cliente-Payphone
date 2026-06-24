import { products } from './products.js';

const cart = {};

export function getCart() {
  return cart;
}

export function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return null;
  if (!cart[id]) cart[id] = { ...product, qty: 0 };
  cart[id].qty++;
  return product;
}

export function removeFromCart(id) {
  delete cart[id];
}

export function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) removeFromCart(id);
}

export function getCartTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getTotalItems() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}
