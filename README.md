# Luxora - Mini E-commerce Web App

A full-stack e-commerce web application built with Laravel and React, featuring role-based authentication, product management, and a modern user interface.

## 📋 Project Overview

Luxora is a comprehensive e-commerce platform that provides secure session-based authentication using Laravel Sanctum, role-based permissions, and intuitive user interfaces for both customers and administrators.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure session-based authentication with Laravel Sanctum
- Role-based access control (Admin/User)
- CSRF protection
- Protected routes

### 👨‍💼 Admin Features
- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products into categories
- **User Management**: Manage user accounts and roles
- **Image Upload**: Product image management with file validation
- **Dashboard**: Administrative overview

### 👤 User Features
- **Product Browsing**: View all available products
- **Category Filtering**: Filter products by categories
- **Search Functionality**: Search products by name or description
- **Responsive Design**: Optimized for all device sizes

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12 with PHP 8.4.1
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **API**: RESTful API architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React hooks
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router
- **File Upload**: React Dropzone

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 16+ and npm
- MySQL

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/NAK110/nak_products.git
cd nak_products

# Navigate to backend folder
cd backend

# Install PHP dependencies
composer install

# Environment setup
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nak_products
DB_USERNAME=root
DB_PASSWORD=

# Configure Sanctum for SPA authentication
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

# Create storage directories
cd storage/app/public
mkdir products
cd ../../..

# Run database migrations and seed data
php artisan migrate --seed

# Start the Laravel development server
php artisan serve
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env

# Configure API endpoint in .env
echo "VITE_API_URL=http://localhost:8000" > .env

# Start the development server
npm run dev
```

## 📁 Project Structure

```
nak_products/
├── backend/               # Laravel API backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── ...
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── storage/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── assets/
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
# Using Makefile commands
make migrate          # Fresh migration
make seed            # Fresh migration with seeding
make start           # Start Laravel server
make route           # List all routes
make opt             # Optimize application

# Or using artisan directly
php artisan migrate:fresh --seed
php artisan serve
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔐 Authentication Flow

1. **CSRF Protection**: Frontend requests CSRF cookie before authentication
2. **Session-based Auth**: Uses Laravel Sanctum for SPA authentication
3. **Role-based Access**: Different interfaces for admin and regular users
4. **Protected Routes**: Frontend routes protected based on authentication status

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/register` - User registration

### Products (Protected)
- `GET /api/products` - List all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Categories (Protected)
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

## 🎨 UI Components

The frontend uses a modern component library built with:
- **shadcn/ui**: Pre-built accessible components
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **React Dropzone**: File upload functionality

## 🔒 Security Features

- CSRF token validation
- Request/response interceptors
- File upload validation
- Session management
- XSS protection
- SQL injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Kosal Vathanak**
- GitHub: [@NAK110](https://github.com/NAK110)

---

Built with ❤️ using Laravel and React
