const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Serve products API
app.get('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
  res.json(products);
});

// ✅ Handle login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read users from users.json
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

  // Find matching user
  const user = users.find(u =>
    u.username.trim() === username.trim() &&
    u.password.trim() === password.trim()
  );

  if (user) {
    res.send(`<p style="color:green;">✅ Login successful! Redirecting to <a href="/cart.html">Cart</a>...</p>
              <script>setTimeout(() => location.href='/cart.html', 2000);</script>`);
  } else {
    res.send(`<p style="color:red;">❌ Invalid username or password</p>
              <a href="/login.html">Try Again</a>`);
  }
});

// ✅ Optional: handle registration POST (if needed in the future)
// app.post('/register', ...);

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
