// server.js with support for full CRUD, soft delete, and restore functionality

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const FILE_PATH = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(express.static('public'));

// Helper to load products
function loadProducts() {
  if (!fs.existsSync(FILE_PATH)) return [];
  const raw = fs.readFileSync(FILE_PATH, 'utf8');
  return JSON.parse(raw);
}

// Helper to save products
function saveProducts(products) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2));
}

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const products = loadProducts();
    res.json(products);
  } catch {
    res.status(500).send("Error loading products");
  }
});

// POST new product
app.post('/api/products', (req, res) => {
  try {
    const products = loadProducts();
    const ids = products.map(p => p.id);
    const nextId = ids.length ? Math.max(...ids) + 1 : 1;
    const newProduct = { ...req.body, id: nextId };
    products.push(newProduct);
    saveProducts(products);
    res.json(newProduct);
  } catch {
    res.status(500).send("Failed to save product");
  }
});

// PUT update existing product
app.put('/api/products/:id', (req, res) => {
  try {
    const products = loadProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).send("Product not found");
    products[index] = { ...products[index], ...req.body };
    saveProducts(products);
    res.json(products[index]);
  } catch {
    res.status(500).send("Failed to update product");
  }
});

// DELETE soft delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).send("Not found");
    product.active = false;
    product.deletedAt = new Date().toISOString();
    saveProducts(products);
    res.json(product);
  } catch {
    res.status(500).send("Failed to delete product");
  }
});

// Restore soft-deleted product
app.post('/api/products/:id/restore', (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).send("Not found");
    product.active = true;
    delete product.deletedAt;
    saveProducts(products);
    res.json(product);
  } catch {
    res.status(500).send("Failed to restore product");
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
