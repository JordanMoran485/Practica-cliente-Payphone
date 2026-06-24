// ── CREDENCIALES ─────────────────────────────────────────────────
export const PAYPHONE_TOKEN    = '_VscCS12NaTq8_-JAEKQR9s5bWpr1sKrYoIQ8TBMxUhQcaP2rDGv_zbRvW3H4pyby23GXyL2V2dBjYv9o48aPgam0fWlPleoeNMzWWm7O02WpH3XA2OOb1vXs4zibb0n7L_SAjnEkwxyRjRKW3XNuRIEBkpak-OCBeWYootuSgUc7IkuI-tQqhu5H8rc-DT9k_-5xoV_n9rzrqHCgJpASGHmGrB-KDCNKJHjK-5hAXHqyBBbPnQpqpd5BhaQvR4LpH_-V4sGQaKumKWHRi2yP7VAoW9f26rY5VsLc8NHe1xxIK4_fMX0k24TYx1priNIb5uEdyqgqmmfoKar6qeU2Kszelo';
export const PAYPHONE_STORE_ID = 'fd0bf378-a4d8-4d50-bd52-65b1e2181d7a';
export const RESPONSE_URL      = 'http://127.0.0.1:5500/respuesta.html';

let ppb = null;

// ── PAYMENT BOX ──────────────────────────────────────────────────
export function renderPaymentBox(amountInCents, clientTransactionId, reference) {
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
}

export function closePaymentBox() {
  document.getElementById('pp-button-wrapper').style.display = 'none';
  document.getElementById('pp-button').innerHTML = '';
  ppb = null;
}
