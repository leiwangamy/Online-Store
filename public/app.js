// app.js for admin product editor with category autocomplete, soft delete, timestamp, and restore support

let products = [];

function assignNextId() {
  const ids = products.map(p => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function renderTable(filtered = products) {
  const sortBy = document.getElementById('sort-order')?.value;
  const tbody = document.querySelector('#product-table tbody');
  tbody.innerHTML = '';

  let sorted = [...filtered].filter(p => p.active !== false); // skip soft deleted
  if (sortBy === 'id') sorted.sort((a, b) => a.id - b.id);
  else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'category') sorted.sort((a, b) => a.category.localeCompare(b.category));

  sorted.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td class="actions">
        <button onclick='editProduct(${p.id})'>Edit</button>
        <button onclick='deleteProduct(${p.id})'>Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  renderRestoreList();
}

function renderRestoreList() {
  const restoreList = document.getElementById('restore-list');
  if (!restoreList) return;
  restoreList.innerHTML = '';
  const expired = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days

  products
    .filter(p => p.active === false && (!p.deletedAt || new Date(p.deletedAt).getTime() >= expired))
    .forEach(p => {
      const row = document.createElement('div');
      row.className = 'restore-item';
      row.innerHTML = `
        <strong>${p.name}</strong> (ID: ${p.id})
        <button onclick='restoreProduct(${p.id})'>Restore</button>
      `;
      restoreList.appendChild(row);
    });
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('product-id').value = p.id;
  document.getElementById('name').value = p.name;
  document.getElementById('category').value = p.category;
  document.getElementById('price').value = p.price;
  document.getElementById('description').value = p.description;
  document.getElementById('media').value = (p.media || []).join(',');
  document.getElementById('stock').value = p.stock;
  document.getElementById('gst').value = p.gst;
  document.getElementById('pst').value = p.pst;
  document.getElementById('shipping').value = p.shipping;
  document.getElementById('tags').value = (p.tags || []).join(',');
}

function deleteProduct(id) {
  if (confirm("Are you sure to delete this product?")) {
    const p = products.find(p => p.id === id);
    if (p) {
      p.active = false;
      p.deletedAt = new Date().toISOString();
      saveChanges(p);
    }
  }
}

function restoreProduct(id) {
  const p = products.find(p => p.id === id);
  if (p) {
    p.active = true;
    delete p.deletedAt;
    saveChanges(p);
  }
}

function saveChanges(product) {
  const method = product.id && products.find(p => p.id === product.id) ? 'PUT' : 'POST';
  const url = method === 'POST' ? '/api/products' : `/api/products/${product.id}`;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  .then(res => res.json())
  .then(saved => {
    const index = products.findIndex(p => p.id === saved.id);
    if (index > -1) {
      products[index] = saved;
    } else {
      products.push(saved);
    }
    renderTable();
    document.getElementById('product-form').reset();
    updateCategoryAutocomplete();
    updateCategoryDropdown();
    updateCategoryTags();
  });
}

function updateCategoryAutocomplete() {
  const datalist = document.getElementById('category-list');
  if (!datalist) return;
  
  datalist.innerHTML = '';
  const allCategories = products.filter(p => p.active !== false).map(p => p.category);
  const uniqueCategories = [...new Set(allCategories.filter(cat => cat))]; // filter out empty categories
  
  uniqueCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    datalist.appendChild(opt);
  });
}

function updateCategoryDropdown() {
  const categorySelect = document.getElementById('category-sort');
  if (!categorySelect) return;
  categorySelect.innerHTML = '<option value="">All</option>';
  const categories = [...new Set(products.filter(p => p.active !== false).map(p => p.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function addNewCategory() {
  const input = document.getElementById('new-category-input');
  const categoryName = input.value.trim();
  
  if (!categoryName) {
    alert('Please enter a category name');
    return;
  }

  const existingCategories = [...new Set(products.map(p => p.category))];
  if (existingCategories.includes(categoryName)) {
    alert('Category already exists');
    return;
  }

  // Set the category in the product form
  document.getElementById('category').value = categoryName;
  input.value = '';
  
  // Update all dropdowns and lists immediately
  updateCategoryAutocomplete();
  updateCategoryDropdown();
  updateCategoryTags();
  
  alert(`Category "${categoryName}" added! You can now create products with this category.`);
}

function updateCategoryTags() {
  const tagsContainer = document.getElementById('category-tags');
  if (!tagsContainer) return;
  
  const productCategories = [...new Set(products.filter(p => p.active !== false).map(p => p.category).filter(cat => cat))];
  const currentCategory = document.getElementById('category')?.value.trim();
  
  // Include current form category if it's new
  const allCategories = currentCategory && !productCategories.includes(currentCategory) 
    ? [...productCategories, currentCategory] 
    : productCategories;
  
  tagsContainer.innerHTML = allCategories.map(cat => 
    `<span style="background:#e3f2fd; padding:4px 8px; margin:2px; border-radius:4px; display:inline-block;">${cat}</span>`
  ).join('');
}

document.getElementById('product-form').addEventListener('submit', e => {
  e.preventDefault();
  let id = document.getElementById('product-id').value;
  const product = {
    id: id ? Number(id) : assignNextId(),
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value,
    media: document.getElementById('media').value ? document.getElementById('media').value.split(',').map(x => x.trim()) : [],
    stock: parseInt(document.getElementById('stock').value),
    gst: parseFloat(document.getElementById('gst').value),
    pst: parseFloat(document.getElementById('pst').value),
    shipping: parseFloat(document.getElementById('shipping').value),
    tags: document.getElementById('tags').value ? document.getElementById('tags').value.split(',').map(x => x.trim()) : [],
    active: true
  };

  saveChanges(product);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('search-box').addEventListener('input', e => {
    const keyword = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.id.toString().includes(keyword)
    );
    renderTable(filtered);
  });

  document.getElementById('category-sort').addEventListener('change', e => {
    const selected = e.target.value;
    const filtered = selected ? products.filter(p => p.category === selected) : products;
    renderTable(filtered);
  });

  document.getElementById('sort-order').addEventListener('change', () => renderTable());

  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      products = data;
      renderTable();
      updateCategoryAutocomplete();
      updateCategoryDropdown();
      updateCategoryTags();
    });
});
