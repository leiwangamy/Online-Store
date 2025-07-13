
# 🌿 Natural Products E-commerce Store

A full-featured online store for natural products built with Node.js, Express, and vanilla JavaScript. This application provides a complete e-commerce solution with user authentication, shopping cart functionality, admin dashboard, and order management.

## ✨ Features

### Customer Features
- **Product Catalog**: Browse natural products with images, videos, and detailed descriptions
- **Search & Filter**: Search products by name and filter by category
- **Shopping Cart**: Add products to cart with quantity management
- **User Authentication**: Register and login system
- **Checkout Process**: Complete order placement with user details
- **Media Gallery**: View product images and videos with modal carousel

### Admin Features
- **Admin Dashboard**: Secure admin panel for store management
- **Product Management**: Create, read, update, and delete products
- **Category Management**: Add and manage product categories
- **Order Management**: View and update order status
- **Soft Delete**: Products can be deleted and restored
- **Media Support**: Upload images and videos for products

### Technical Features
- **Responsive Design**: Mobile-friendly interface
- **Local Storage**: Cart persistence across sessions
- **Real-time Updates**: Dynamic content updates
- **Tax Calculation**: GST and PST tax support
- **Shipping Costs**: Per-product shipping calculation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/natural-products-store.git
cd natural-products-store
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
├── public/                 # Frontend files
│   ├── images/            # Product images
│   ├── videos/            # Product videos
│   ├── index.html         # Main storefront
│   ├── cart.html          # Shopping cart page
│   ├── checkout.html      # Checkout process
│   ├── admin-dashboard.html # Admin product management
│   ├── admin-orders.html  # Admin order management
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── account.html       # User account page
│   ├── app.js            # Admin dashboard JavaScript
│   └── style.css         # Styling
├── server.js             # Express server and API routes
├── package.json          # Dependencies and scripts
├── products.json         # Product data storage
├── users.json           # User data storage
└── orders.json          # Order data storage
```

## 🛠️ API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Soft delete product (admin)
- `POST /api/products/:id/restore` - Restore deleted product (admin)

### Authentication
- `POST /login` - User login
- `POST /register` - User registration

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

## 💾 Data Storage

The application uses JSON files for data persistence:

- **products.json**: Stores product information including name, category, price, description, media files, taxes, and shipping costs
- **users.json**: Stores user account information (username, password, full name, address)
- **orders.json**: Stores order details and status

## 🎨 Customization

### Adding New Products
1. Access the admin dashboard at `/admin-dashboard.html`
2. Use the product management form to add products
3. Upload images to the `/public/images/` directory
4. Upload videos to the `/public/videos/` directory

### Styling
Modify `/public/style.css` to customize the appearance of your store.

### Categories
Add new product categories through the admin dashboard category management section.

## 🔒 Security Features

- User authentication with session management
- Admin-only access to management functions
- Input validation and sanitization
- Secure password handling

## 📱 Responsive Design

The store is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

This application is designed to run on Replit. To deploy:

1. Fork this repository on Replit
2. The application will automatically start
3. Your store will be accessible via the provided Replit URL

## 🛒 Sample Products

The store comes with sample natural products:
- Aloe Vera Gel (Skin Care)
- Insect Ointment (First Aid)
- Facial Mask (Beauty)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 🔄 Updates

Check the repository regularly for updates and new features!

---

**Built with ❤️ for natural product enthusiasts**
