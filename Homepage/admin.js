let currentSearchTerm = "";
let currentFilterCategory = "";
let currentSort = "";

function filterAndRenderProducts() {
  let products = JSON.parse(localStorage.getItem("storeProducts")) || [];

  if (currentSearchTerm) {
    products = products.filter(p =>
      p.title.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
  }

  if (currentFilterCategory && currentFilterCategory !== "Category") {
    products = products.filter(p => p.category === currentFilterCategory);
  }

  if (currentSort === "title") {
    products.sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentSort === "price") {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === "category") {
    products.sort((a, b) => a.category.localeCompare(b.category));
  }

  renderProductTable(products);
}

function renderProductTable(products) {
  const table = document.getElementById("productTable");
  const countDisplay = document.getElementById("productCount");
  table.innerHTML = "";
  countDisplay.innerHTML = `Total Products: ${products.length}`;

  if (products.length === 0) {
    table.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No products found.</td></tr>`;
    return;
  }

  products.forEach((p, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${p.image}" alt="${p.title}" style="width: 60px; height: 60px; object-fit: contain;"></td>
        <td>${p.title}</td>
        <td>₹${p.price}</td>
        <td>${p.category || "-"}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editProduct(${index})">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="removeProduct(${p.id})">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </td>
      </tr>
    `;
  });
}

document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const imageURL = document.getElementById("imageURL").value.trim();
  const imageFile = document.getElementById("imageFile").files[0];
  const price = parseFloat(document.getElementById("price").value.trim());
  const category = document.getElementById("category").value.trim();
  const editIndex = document.getElementById("editIndex").value;
  const status = document.getElementById("status");
  status.innerHTML = "";

  if (!title || isNaN(price) || !category) {
    status.innerHTML = `<div class="alert alert-danger">All fields except image are required.</div>`;
    return;
  }

  const saveOrUpdate = (imageSrc) => {
    let products = JSON.parse(localStorage.getItem("storeProducts")) || [];
    if (editIndex !== "") {
      products[editIndex].title = title;
      products[editIndex].price = price;
      products[editIndex].image = imageSrc;
      products[editIndex].category = category;
      status.innerHTML = `<div class="alert alert-info">Product updated successfully!</div>`;
    } else {
      const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 0,
        title,
        image: imageSrc,
        price,
        category
      };
      products.push(newProduct);
      status.innerHTML = `<div class="alert alert-success">Product added successfully!</div>`;
    }

    localStorage.setItem("storeProducts", JSON.stringify(products));
    document.getElementById("productForm").reset();
    document.getElementById("editIndex").value = "";
    document.getElementById("submitBtn").innerText = "Add";
    filterAndRenderProducts();
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveOrUpdate(event.target.result);
    };
    reader.readAsDataURL(imageFile);
  } else if (imageURL) {
    saveOrUpdate(imageURL);
  } else {
    status.innerHTML = `<div class="alert alert-danger">Please provide an image.</div>`;
  }
});

function removeProduct(id) {
  let products = JSON.parse(localStorage.getItem("storeProducts")) || [];
  products = products.filter(p => p.id !== id);
  localStorage.setItem("storeProducts", JSON.stringify(products));
  filterAndRenderProducts();
}

function editProduct(index) {
  const products = JSON.parse(localStorage.getItem("storeProducts")) || [];
  const p = products[index];
  document.getElementById("title").value = p.title;
  document.getElementById("price").value = p.price;
  document.getElementById("imageURL").value = p.image.startsWith("data:") ? "" : p.image;
  document.getElementById("category").value = p.category || "";
  document.getElementById("editIndex").value = index;
  document.getElementById("submitBtn").innerText = "Update";
  document.getElementById("imageFile").value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onload = () => {
  filterAndRenderProducts();

  document.getElementById("searchInput").addEventListener("input", function () {
    currentSearchTerm = this.value;
    filterAndRenderProducts();
  });

  document.getElementById("categoryFilter").addEventListener("change", function () {
    currentFilterCategory = this.value;
    filterAndRenderProducts();
  });

  document.getElementById("sortSelect").addEventListener("change", function () {
    currentSort = this.value;
    filterAndRenderProducts();
  });
};
