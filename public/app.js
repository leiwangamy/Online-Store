// ✅ Global storage for all products
let allProducts = [];

// ✅ Update cart count display
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// ✅ Show temporary alert
function showTemporaryAlert(message, duration = 2000) {
  const alertBox = document.getElementById("custom-alert");
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, duration);
}

// ✅ Save to localStorage with tax/shipping info
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let found = cart.find((item) => item.id === product.id);

  if (found) {
    found.quantity += 1;
  } else {
    product.quantity = 1;

    // ✅ Add tax and shipping details from full product info
    const full = allProducts.find((p) => p.id === product.id);
    if (full) {
      product.gst = full.gst || 0;
      product.pst = full.pst || 0;
      product.shipping = full.shipping || 0;
    }

    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showTemporaryAlert(`✅ Added ${product.name} to cart`);
  updateCartCount();
}

// ✅ Fetch products and display them
fetch("/api/products")
  .then((response) => response.json())
  .then((products) => {
    allProducts = products; // ✅ Save all product data
    const list = document.getElementById("product-list");

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      const title = document.createElement("h2");
      title.textContent = product.name;
      card.appendChild(title);

      product.images.forEach((imageUrl) => {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = product.name;
        img.className = "product-image";
        card.appendChild(img);
      });

      const price = document.createElement("p");
      price.textContent = `$${product.price.toFixed(2)}`;
      card.appendChild(price);

      const description = document.createElement("p");
      description.textContent = product.description;
      card.appendChild(description);

      // ✅ Add to Cart button
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

      // ✅ Append card to product list
      list.appendChild(card);
    });

    updateCartCount(); // ✅ Initialize cart count on load
  });
