fetch('/api/products')
.then(res => res.json())
.then(products => {
  const list = document.getElementById('product-list');

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const name = document.createElement('h2');
    name.textContent = product.name;
    card.appendChild(name);

    product.images.forEach(imgSrc => {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = product.name;
      img.className = 'product-image';
      img.width = 150;
      card.appendChild(img);
    });

    const price = document.createElement('p');
    price.textContent = `$${product.price.toFixed(2)}`;
    card.appendChild(price);

    const desc = document.createElement('p');
    desc.textContent = product.description;
    card.appendChild(desc);

    list.appendChild(card);
  });
})
.catch(error => {
  console.error("❌ Failed to load products:", error);
});
