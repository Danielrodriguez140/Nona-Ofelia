// ===== MENU DATA =====
/*const MENU = {
    breakfast: [
        { id: 'b1', emoji: '☕', name: 'Café Americano', price: 5 },
        { id: 'b2', emoji: '☕', name: 'Café con Leche', price: 7 },
        { id: 'b3', emoji: '🥪', name: 'Sandwich de Jamón y Queso', price: 10 },
        { id: 'b4', emoji: '🍊', name: 'Jugo Natural', price: 7 },
    ],
    burgers: [
        { id: 'h1', emoji: '🍔', name: 'Hamburguesa Simple (Res)', price: 10, note: 'Res' },
        { id: 'h2', emoji: '🍔', name: 'Hamburguesa Doble (Res)', price: 15, note: 'Res' },
        { id: 'h3', emoji: '🍗', name: 'Hamburguesa Simple (Pollo)', price: 10, note: 'Pollo' },
        { id: 'h4', emoji: '🍗', name: 'Hamburguesa Doble (Pollo)', price: 15, note: 'Pollo' },
        { id: 'h5', emoji: '🥦', name: 'Hamburguesa Simple (Veggie)', price: 10, note: 'Vegetariana' },
        { id: 'h6', emoji: '🥦', name: 'Hamburguesa Doble (Veggie)', price: 15, note: 'Vegetariana' },
    ],
    sides: [
        { id: 's1', emoji: '🍟', name: 'Papas Fritas', price: 5 },
        { id: 's2', emoji: '🧅', name: 'Onion Rings', price: 5 },
    ],
    drinks: [
        { id: 'd1', emoji: '💧', name: 'Agua 500ml', price: 5 },
        { id: 'd2', emoji: '💧', name: 'Agua 750ml', price: 8 },
        { id: 'd3', emoji: '🥤', name: 'Refresco 500ml', price: 7 },
        { id: 'd4', emoji: '🥤', name: 'Refresco 750ml', price: 10 },
    ],
    extras: [
        { id: 'e1', emoji: '🧀', name: 'Extra Queso', price: 1 },
        { id: 'e2', emoji: '🍳', name: 'Extra Huevo', price: 1 },
    ]
};*/

const PRODUCTS = [
    { id: 1, name: "Sorrentinos de jamón y mozzarella", desc: "Relleno cremoso, masa fina artesanal", price: 4000, emoji: "🫓", cat: "Sorrentinos", unit: "caja" },
    { id: 2, name: "Sorrentinos de ricota y espinaca", desc: "Con queso fresco y espinaca salteada", price: 400, emoji: "🫓", cat: "Sorrentinos", unit: "caja" },
    { id: 3, name: "Sorrentinos de carne", desc: "Relleno de carne braseada y verduras", price: 400, emoji: "🫓", cat: "Sorrentinos", unit: "caja" },
    { id: 4, name: "Sorrentinos 4 quesos", desc: "Mozzarella, provolone, parmesano y ricota", price: 400, emoji: "🫓", cat: "Sorrentinos", unit: "caja" },
    { id: 5, name: "Sorrentinos de pollo", desc: "Pollo desmenuzado con ciboulette", price: 400, emoji: "🫓", cat: "Sorrentinos", unit: "caja" },
    { id: 6, name: "Sorrentinos de calabaza", desc: "Calabaza asada con nuez moscada", price: 400, emoji: "🫓", cat: "Sorrentinos", unit: "caja" },
    /*{ id: 7, name: "Salsa fileto", desc: "Tomate natural con albahaca fresca", price: 900, emoji: "🍅", cat: "Salsas", unit: "porción" },
    { id: 8, name: "Salsa bolognesa", desc: "Carne picada con vino y especias", price: 1200, emoji: "🥫", cat: "Salsas", unit: "porción" },
    { id: 9, name: "Salsa crema", desc: "Crema de leche con ajo y perejil", price: 850, emoji: "🧄", cat: "Salsas", unit: "porción" },*/

];

// ===== STATE =====
let order = {}; // { id: { item, qty } }

// ===== RENDER MENUS =====
function renderGrid(gridId, items) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.desc}</div>
        <div class="item-price">${item.price}</div>
        
        ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
      `;
        div.addEventListener('click', () => addItem(item, div));
        grid.appendChild(div);
    });
}

renderGrid('grid-breakfast', PRODUCTS);
//renderGrid('grid-burgers', MENU.burgers);
//renderGrid('grid-sides', MENU.sides);
//renderGrid('grid-drinks', MENU.drinks);
//renderGrid('grid-extras', MENU.extras);

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    });
});

// ===== ORDER LOGIC =====
function addItem(item, el) {
    if (order[item.id]) {
        order[item.id].qty++;
    } else {
        order[item.id] = { item, qty: 1 };
    }
    el.classList.add('adding');
    setTimeout(() => el.classList.remove('adding'), 300);
    renderOrder();
}

function changeQty(id, delta) {
    if (!order[id]) return;
    order[id].qty += delta;
    if (order[id].qty <= 0) delete order[id];
    renderOrder();
}

function clearOrder() {
    order = {};
    renderOrder();
}
function toggleCart() {
    const panel = document.querySelector('.order-panel');
    panel.classList.toggle('mobile-open');
}

function renderOrder() {
    const container = document.getElementById('orderItems');
    const empty = document.getElementById('orderEmpty');
    const entries = Object.values(order);

    // Customer name
    const name = document.getElementById('clientName').value.trim();
    document.getElementById('orderCustomer').innerHTML = name
        ? `Cliente: <span>${name}</span>`
        : 'Sin cliente';

    // Items
    const existing = container.querySelectorAll('.order-row');
    existing.forEach(e => e.remove());

    if (entries.length === 0) {
        empty.style.display = 'flex';
    } else {
        empty.style.display = 'none';
        entries.forEach(({ item, qty }) => {
            const row = document.createElement('div');
            row.className = 'order-row';
            row.innerHTML = `
          <div class="order-row-emoji">${item.emoji}</div>
          <div class="order-row-info">
            <div class="order-row-name">${item.name}</div>
            <div class="order-row-price">$${(item.price * qty).toFixed(0)}</div>
          </div>
          <div class="qty-ctrl">
            <button class="qty-btn minus" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn plus" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        `;
            container.appendChild(row);
        });
    }

    // Total
    const total = entries.reduce((s, { item, qty }) => s + item.price * qty, 0);
    const count = entries.reduce((s, { qty }) => s + qty, 0);

    // AGREGAR ESTA LÍNEA para mobil
    if (document.getElementById('mobileBadge')) {
        document.getElementById('mobileBadge').textContent = count;
    }

    document.getElementById('sendBtn').disabled = entries.length === 0;

    document.getElementById('subtotalDisplay').textContent = '$' + total;
    document.getElementById('totalDisplay').textContent = total;
    document.getElementById('itemCount').textContent = count;
    document.getElementById('sendBtn').disabled = entries.length === 0;




}

// Client name live update
document.getElementById('clientName').addEventListener('input', renderOrder);

// Eviar mensaje WSP
function sendWA() {
    const items = Object.entries(order);
    /*if (items.length === 0) { showToast("El carrito está vacío"); return; }*/
    const nombre = document.getElementById("clientName").value.trim() || "Cliente";
    //const nota = document.getElementById("cnota").value.trim();
    let total = 0;



    let lines = items.map((e) => {
        const p = PRODUCTS.find(x => x.id == e[0]);
        const sub = p.price * e[1].qty;
        total += sub;
        return `• ${p.name} x${e[1].qty} ${p.unit} = $${sub.toLocaleString('es-AR')}`;
    });


    let msg = `Hola Nona Ofelia! Soy *${nombre}* y quiero hacer el siguiente pedido:%0A%0A${lines.join('%0A')}%0A%0A*Total: $${total.toLocaleString('es-AR')}*`;
    /*if (nota) msg += `%0A%0A_Nota: ${nota}_`;*/
    msg += `%0A%0AMuchas gracias!`;
    window.open(`https://wa.me/543512636819?text=${msg}`, "_blank");
}

// ===== SEND ORDER =====
function sendOrder() {
    const entries = Object.values(order);
    if (entries.length === 0) return;

    const toast = document.getElementById('toast');
    const name = document.getElementById('clientName').value.trim();
    toast.textContent = name
        ? `✅ Pedido de ${name} enviado a Nona Ofelia!`
        : '✅ ¡Pedido enviado a Nona Ofelia!';

    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3500);

    sendWA();

    // Reset
    clearOrder();
    document.getElementById('clientName').value = '';
    renderOrder();
}

let prueba = Object.values(order);

renderOrder();