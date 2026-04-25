const WSP_NUMBER = "543512636819"; // ← REEMPLAZÁ con tu número real (con código de país, sin +)

const products = [
    { id: 1, name: "Sorrentinos de Jamón y Queso", tipo: "Sorrentinos", desc: "Rellenos con jamón cocido seleccionado y queso cremoso. Clásico irresistible.", price: 1800, emoji: "🧀" },
    { id: 2, name: "Sorrentinos de Pollo", tipo: "Sorrentinos", desc: "Con tierno pollo sazonado, cebolla caramelizada y toque de crema. Muy rellenos.", price: 1800, emoji: "🍗" },
    { id: 3, name: "Sorrentinos de Ricota y Espinaca", tipo: "Sorrentinos", desc: "Ricota fresca con espinaca salteada. Suaves, livianos y llenos de sabor.", price: 1800, emoji: "🌿" },
    { id: 4, name: "Sorrentinos de Carne", tipo: "Sorrentinos", desc: "Carne picada especiada con verduras, receta de la Nona. Los más pedidos.", price: 1900, emoji: "🥩" },
    { id: 5, name: "Combinado (2 sabores)", tipo: "Variedad", desc: "Elegí 2 sabores a tu gusto. Ideal para los que no se pueden decidir.", price: 3400, emoji: "🍝" },
    { id: 6, name: "Porción familiar (4 sabores)", tipo: "Variedad", desc: "Los 4 sabores en una sola caja. Relleno abundante garantizado en cada uno.", price: 6500, emoji: "🏡" },
];

let cart = {};

function renderProducts() {
    const g = document.getElementById("products-grid");
    g.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="card-ribbon">
        <span class="emoji">${p.emoji}</span>
        <h3>${p.name}</h3>
        <span class="tipo">${p.tipo}</span>
      </div>
      <div class="card-body">
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <div class="price">$${p.price.toLocaleString('es-AR')}<span class="unit">por docena</span></div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Agregar</button>
        </div>
      </div>
    </div>`).join("");
}

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    updateCart();
    const panel = document.getElementById("cart-panel");
    if (!panel.classList.contains("open")) toggleCart();
}

function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    updateCart();
}

function updateCart() {
    const keys = Object.keys(cart);
    const count = keys.reduce((s, k) => s + cart[k], 0);
    document.getElementById("cart-count").textContent = count;

    const itemsEl = document.getElementById("cart-items");
    if (keys.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Tu pedido está vacío.<br>¡Elegí tus pastas!</p>';
        document.getElementById("cart-total").textContent = "$0";
        document.getElementById("wsp-btn").disabled = true;
        return;
    }

    let total = 0;
    itemsEl.innerHTML = keys.map(k => {
        const p = products.find(x => x.id == k);
        const sub = p.price * cart[k];
        total += sub;
        return `<div class="cart-item">
      <div class="cart-item-name">${p.emoji} ${p.name}<small>$${p.price.toLocaleString('es-AR')} c/u</small></div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${k},-1)">−</button>
        <span class="qty-num">${cart[k]}</span>
        <button class="qty-btn" onclick="changeQty(${k},1)">+</button>
      </div>
      <div class="item-price">$${sub.toLocaleString('es-AR')}</div>
    </div>`;
    }).join("");

    document.getElementById("cart-total").textContent = "$" + total.toLocaleString('es-AR');
    document.getElementById("wsp-btn").disabled = false;
}

function toggleCart() {
    document.getElementById("cart-panel").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("open");
}

function sendWhatsApp() {
    const keys = Object.keys(cart);
    if (!keys.length) return;
    let msg = "🍝 *Hola Nona Ofelia! Quiero hacer el siguiente pedido:*\n\n";
    let total = 0;
    keys.forEach(k => {
        const p = products.find(x => x.id == k);
        const sub = p.price * cart[k];
        total += sub;
        msg += `• ${p.name} x${cart[k]} = $${sub.toLocaleString('es-AR')}\n`;
    });
    msg += `\n*Total estimado: $${total.toLocaleString('es-AR')}*\n\n¿Podés confirmar disponibilidad y coordinar la entrega? ¡Muchas gracias!`;
    const url = `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
}

renderProducts();