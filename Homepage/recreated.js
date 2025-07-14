const defaultProducts = [
  { id: 0, image: 'https://m.media-amazon.com/images/I/719RiDAGXtL._SL1500_.jpg', title: 'Classic Smart Watch', price: 2499, category: 'Watch' },
  { id: 1, image: 'https://m.media-amazon.com/images/I/61JtVmcxb0L._SL1080_.jpg', title: 'Urban Smart Watch', price: 2899, category: 'Watch' },
  { id: 2, image: 'https://m.media-amazon.com/images/I/61QMdK2FrXL._SL1500_.jpg', title: 'Galaxy Watch 57', price: 3199, category: 'Watch' },
  { id: 3, image: 'https://m.media-amazon.com/images/I/71NJJsDK3aL._AC_UL320_.jpg', title: 'Cool T-Shirt', price: 899, category: 'T-Shirt' },
  { id: 4, image: 'https://m.media-amazon.com/images/I/71TdrfKaWnL._AC_UL320_.jpg', title: 'Formal Shirt', price: 1199, category: 'Shirt' },
  { id: 5, image: 'https://m.media-amazon.com/images/I/61md3szAgLL._AC_UL320_.jpg', title: 'Running Shoes', price: 1799, category: 'Shoes' },
  { id: 6, image: 'https://m.media-amazon.com/images/I/61FoXNc8PjL._AC_UL320_.jpg', title: 'Winter Jacket', price: 2599, category: 'Jacket' },
  { id: 7, image: 'https://m.media-amazon.com/images/I/61OMSsGhZxL._SX679_.jpg', title: 'Stylish Sunglasses', price: 499, category: 'Sunglasses' }
];

let products = JSON.parse(localStorage.getItem("storeProducts")) || defaultProducts;
localStorage.setItem("storeProducts", JSON.stringify(products));

let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

function productCard(item) {
  return `
    <div class="card product-card shadow-sm">
      <div class="product-image-container">
        <img src="${item.image}" class="img-fluid" alt="${item.title}">
      </div>
      <div class="card-body text-center">
        <h6 class="card-title">${item.title}</h6>
        <p class="fw-bold text-success">₹ ${item.price}.00</p>
        <button class="btn btn-dark btn-sm w-100" onclick="addToCart(${item.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function displayAllCategories() {
  const container = document.getElementById('root');
  container.innerHTML = '';

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach((category, index) => {
    const categoryItems = products.filter(p => p.category === category);
    const rowId = `scroll-row-${index}`;

    const rowHTML = `
      <h5 class="fw-bold mb-3">${category}</h5>
      <div class="scroll-row-wrapper mb-5">
        <div class="scroll-arrow scroll-left" onclick="scrollLeft('${rowId}')">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
        <div id="${rowId}" class="scroll-row">
          ${categoryItems.map(productCard).join('')}
        </div>
        <div class="scroll-arrow scroll-right" onclick="scrollRight('${rowId}')">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    `;

    const section = document.createElement('div');
    section.innerHTML = rowHTML;
    container.appendChild(section);
  });
}

function scrollRight(rowId) {
  const row = document.getElementById(rowId);
  row.scrollLeft += 300;
}

function scrollLeft(rowId) {
  const row = document.getElementById(rowId);
  row.scrollLeft -= 300;
}

function filterByCategory(category) {
  if (!category) {
    displayAllCategories();
    return;
  }
  const filtered = products.filter(item => item.category.toLowerCase() === category.toLowerCase());
  document.getElementById('root').innerHTML = `
    <h5 class="fw-bold mb-3">${category}</h5>
    <div class="row">
      ${filtered.map(productCard).join('')}
    </div>
  `;
}

document.getElementById('searchBar').addEventListener('keyup', (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = products.filter(item => item.title.toLowerCase().includes(value));
  document.getElementById('root').innerHTML = `
    <div class="row">
      ${filtered.map(productCard).join('')}
    </div>
  `;
});

function addToCart(id) {
  const selected = products.find(p => p.id === id);
  if (selected) {
    cart.push({ ...selected });
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateCartCount();
  }
}

function updateCartCount() {
  document.getElementById("count").innerText = cart.length;
}

window.onload = () => {
  displayAllCategories();
  updateCartCount();
};
