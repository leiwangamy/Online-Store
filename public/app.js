// app.js for admin product editor

let products = [];

function assignNextId() {
  const ids = products.map(p => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function renderTable(filtered = products) {
  const sortBy = document.getElementById('sort-order')?.value;
  const tbody = document.querySelector('#product-table tbody');
  tbody.innerHTML = '';

  let sorted = [...filtered];
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
    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      products = products.filter(p => p.id !== id);
      renderTable();
    });
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
  });
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
    media: document.getElementById('media').value.split(',').map(x => x.trim()),
    stock: parseInt(document.getElementById('stock').value),
    gst: parseFloat(document.getElementById('gst').value),
    pst: parseFloat(document.getElementById('pst').value),
    shipping: parseFloat(document.getElementById('shipping').value),
    tags: document.getElementById('tags').value.split(',').map(x => x.trim()),
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

      const categorySelect = document.getElementById('category-sort');
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      uniqueCategories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      });
    });
});
