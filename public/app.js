let allProducts = [];

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

function showTemporaryAlert(message, duration = 2000) {
  const alertBox = document.getElementById("custom-alert");
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, duration);
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let found = cart.find((item) => item.id === product.id);

  if (found) {
    found.quantity += 1;
  } else {
    product.quantity = 1;
    const full = allProducts.find((p) => p.id === product.id);
    if (full) {
      product.gst = full.gst || 0;
      product.pst = full.pst || 0;
      product.shipping = full.shipping || 0;
      product.image = full.images?.[0] || "";
    }
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showTemporaryAlert(`✅ Added ${product.name} to cart`);
  updateCartCount();
}

function fetchUserInfo() {
  fetch("/api/user")
    .then((res) => res.json())
    .then((data) => {
      const userInfo = document.getElementById("user-info");
      const logoutLink = document.getElementById("logout-link");
      const accountLink = document.getElementById("account-link");
      if (data.username && userInfo && logoutLink) {
        userInfo.textContent = `🕤 Logged in as: ${data.username}`;
        logoutLink.style.display = "inline";
        if (accountLink) accountLink.style.display = "inline";
      }
    });
}

function logout() {
  fetch("/logout", { method: "POST" })
    .then(() => {
      localStorage.removeItem("cart");
      window.location.href = "/login.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      allProducts = products;
      updateCartCount();
      fetchUserInfo();

      const searchInput = document.getElementById("search-input");
      const categoryFilter = document.getElementById("category-filter");

      // Populate categories
      if (categoryFilter) {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        uniqueCategories.forEach(cat => {
          const option = document.createElement("option");
          option.value = cat;
          option.textContent = cat;
          categoryFilter.appendChild(option);
        });
      }

      // Filtering logic
      const applyFilters = () => {
        const keyword = searchInput?.value.toLowerCase() || "";
        const selectedCategory = categoryFilter?.value || "";

        const filtered = allProducts.filter(p =>
          (p.name.toLowerCase().includes(keyword) ||
           (p.category && p.category.toLowerCase().includes(keyword))) &&
          (selectedCategory === "" || p.category === selectedCategory)
        );

        renderProducts(filtered);
      };

      if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
      }

      if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilters);
      }

      renderProducts(products); // initial render
    });
});

function renderProducts(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const title = document.createElement("h2");
    title.textContent = product.name;
    card.appendChild(title);

    const img = document.createElement("img");
    img.src = product.images?.[0] || "";
    img.alt = product.name;
    img.className = "product-image";
    img.style.cursor = "pointer";
    img.onclick = () => {
      window.location.href = `product.html?id=${product.id}`;
    };
    card.appendChild(img);

    const price = document.createElement("p");
    price.textContent = `$${product.price.toFixed(2)}`;
    card.appendChild(price);

    const description = document.createElement("p");
    description.textContent = product.description;
    card.appendChild(description);

    const button = document.createElement("button");
    button.textContent = "Add to Cart";
    button.className = "add-to-cart-button";
    button.onclick = () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
      });
    };
    card.appendChild(button);

    list.appendChild(card);
  });
}
