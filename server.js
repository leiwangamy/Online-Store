const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For JSON requests like fetch
app.use(express.static('public'));
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}));

// ✅ GET: Serve all products
app.get('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
  res.json(products);
});

// ✅ GET: Return current user info if logged in
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    const { username, fullName, address } = req.session.user;
    res.json({ username, fullName, address });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// ✅ POST: Login using fetch (JSON body)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

  const user = users.find(u =>
    u.username.trim() === username.trim() &&
    u.password.trim() === password.trim()
  );

  if (user) {
    req.session.user = user;
    res.json({
      username: user.username,
      fullName: user.fullName || '',
      address: user.address || ''
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// ✅ POST: Register new user
app.post('/register', (req, res) => {
  const { fullName, address, email, password } = req.body;
  const usersFile = 'users.json';

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  }

  const exists = users.find(u => u.username === email.trim());
  if (exists) {
    return res.send(`
      <p style="color:red;">⚠️ This email is already registered.</p>
      <a href="/register.html">Try Again</a>
    `);
  }

  const newUser = {
    username: email.trim(),
    password: password.trim(),
    fullName: fullName.trim(),
    address: address.trim()
  };

  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');

  res.send(`
    <p style="color:green;">✅ Registration successful! Redirecting to login...</p>
    <script>setTimeout(() => location.href='/login.html', 2000);</script>
  `);
});

// ✅ GET: Logout user
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
