/* ============================================================
   FURNISH & CO. — CART JS
   localStorage-backed cart + wishlist, badge sync, cart page render
   ============================================================ */

const Cart = {
  key: 'furnish-cart',
  wishKey: 'furnish-wishlist',

  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch (e) { return []; }
  },
  save(items) { localStorage.setItem(this.key, JSON.stringify(items)); this.syncBadges(); },

  add(product) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) existing.qty += product.qty || 1;
    else items.push({ ...product, qty: product.qty || 1 });
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  updateQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) item.qty = Math.max(1, qty);
    this.save(items);
  },
  clear() { this.save([]); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  subtotal() { return this.get().reduce((sum, i) => sum + i.price * i.qty, 0); },

  getWish() {
    try { return JSON.parse(localStorage.getItem(this.wishKey)) || []; }
    catch (e) { return []; }
  },
  saveWish(items) { localStorage.setItem(this.wishKey, JSON.stringify(items)); this.syncBadges(); },
  toggleWish(product) {
    let items = this.getWish();
    if (items.find(i => i.id === product.id)) items = items.filter(i => i.id !== product.id);
    else items.push(product);
    this.saveWish(items);
  },

  syncBadges() {
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = this.count());
    document.querySelectorAll('[data-wish-count]').forEach(el => el.textContent = this.getWish().length);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.syncBadges();

  /* ---------- Add to cart buttons ---------- */
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('[data-product]');
      const product = card ? {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        img: card.dataset.img,
        qty: 1
      } : {
        id: btn.dataset.id || 'demo-item',
        name: btn.dataset.name || 'Selected Product',
        price: parseFloat(btn.dataset.price) || 199,
        img: btn.dataset.img || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
        qty: parseInt(document.querySelector('.qty-selector input')?.value) || 1
      };
      Cart.add(product);
      if (window.showToast) window.showToast('Added to cart', `${product.name} was added to your cart.`);
    });
  });

  /* ---------- Render cart page ---------- */
  const cartBody = document.querySelector('#cartTableBody');
  if (cartBody) renderCartPage();

  function renderCartPage() {
    const items = Cart.get();
    const emptyState = document.querySelector('#cartEmpty');
    const cartContent = document.querySelector('#cartContent');
    if (!items.length) {
      if (emptyState) emptyState.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (cartContent) cartContent.style.display = '';

    cartBody.innerHTML = items.map(item => `
      <tr data-row="${item.id}">
        <td>
          <div class="cart-prod">
            <img src="${item.img}" alt="${item.name}">
            <div>
              <b>${item.name}</b><br>
              <button class="cart-remove" data-remove="${item.id}"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <div class="qty-selector">
            <button class="qty-minus" data-dec="${item.id}">−</button>
            <input type="text" readonly value="${item.qty}">
            <button class="qty-plus" data-inc="${item.id}">+</button>
          </div>
        </td>
        <td><b>$${(item.price * item.qty).toFixed(2)}</b></td>
      </tr>
    `).join('');

    updateCartSummary();

    cartBody.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      Cart.remove(b.dataset.remove); renderCartPage();
    }));
    cartBody.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => {
      const item = Cart.get().find(i => i.id === b.dataset.inc);
      Cart.updateQty(b.dataset.inc, item.qty + 1); renderCartPage();
    }));
    cartBody.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => {
      const item = Cart.get().find(i => i.id === b.dataset.dec);
      Cart.updateQty(b.dataset.dec, item.qty - 1); renderCartPage();
    }));
  }

  function updateCartSummary() {
    const subtotal = Cart.subtotal();
    const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 35) : 0;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = '$' + val.toFixed(2); };
    set('#sumSubtotal', subtotal);
    set('#sumShipping', shipping);
    set('#sumTax', tax);
    set('#sumTotal', total);
    const shipEl = document.querySelector('#sumShipping');
    if (shipEl && shipping === 0 && subtotal > 0) shipEl.textContent = 'Free';
  }

  /* ---------- Coupon (demo) ---------- */
  document.querySelector('#couponForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = e.target.querySelector('input').value.trim().toUpperCase();
    if (code === 'FURNISH10') {
      window.showToast('Coupon applied', '10% discount added to your order.');
    } else {
      window.showToast('Invalid coupon', 'Please check your code and try again.');
    }
  });

  /* ---------- Checkout summary render ---------- */
  const checkoutSummary = document.querySelector('#checkoutSummary');
  if (checkoutSummary) {
    const items = Cart.get();
    checkoutSummary.innerHTML = items.map(i => `
      <div class="summary-row"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>
    `).join('') || '<p style="color:var(--color-dark-soft);font-size:.88rem;">Your cart is empty.</p>';
    const subtotal = Cart.subtotal();
    const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 35) : 0;
    const tax = subtotal * 0.05;
    document.querySelector('#checkoutSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.querySelector('#checkoutShipping').textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    document.querySelector('#checkoutTax').textContent = '$' + tax.toFixed(2);
    document.querySelector('#checkoutTotal').textContent = '$' + (subtotal + shipping + tax).toFixed(2);
  }

  document.querySelector('#placeOrderForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    Cart.clear();
    window.showToast('Order placed!', 'Thank you — your order was placed successfully.');
    setTimeout(() => { window.location.href = 'index.html'; }, 1800);
  });

  /* ---------- Wishlist page render ---------- */
  const wishBody = document.querySelector('#wishlistGrid');
  if (wishBody) {
    const items = Cart.getWish();
    const emptyState = document.querySelector('#wishEmpty');
    if (!items.length) {
      if (emptyState) emptyState.style.display = 'block';
      wishBody.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      wishBody.style.display = '';
      wishBody.innerHTML = items.map(item => `
        <div class="product-card">
          <div class="product-thumb">
            <img src="${item.img}" alt="${item.name}">
            <div class="product-quick-actions">
              <button class="pq-btn" data-wish-remove="${item.id}"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>
          <div class="product-info">
            <p class="product-cat">Furniture</p>
            <h3 class="product-name">${item.name}</h3>
            <div class="product-price"><span class="price-now">$${item.price.toFixed(2)}</span></div>
          </div>
        </div>
      `).join('');
      wishBody.querySelectorAll('[data-wish-remove]').forEach(b => b.addEventListener('click', () => {
        Cart.saveWish(Cart.getWish().filter(i => i.id !== b.dataset.wishRemove));
        location.reload();
      }));
    }
  }
});
