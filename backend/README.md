# Luxora Backend API

Laravel backend API for the Luxora e-commerce application with role-based authentication and product management.

## 🚀 Features

### Authentication & Authorization
- Laravel Sanctum for SPA authentication
- Role-based access control (Admin/User)
- CSRF protection
- Session-based authentication

### API Endpoints
- **Products CRUD** - Complete product management
- **Categories CRUD** - Product categorization
- **User Management** - User account management
- **File Upload** - Product image handling
- **Authentication** - Login/logout/register

### Database
- MySQL database with migrations
- Database seeders for initial data
- Eloquent ORM relationships
- Foreign key constraints

## 🛠️ Tech Stack

- **Framework**: Laravel 12
- **PHP Version**: 8.4.1
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **File Storage**: Laravel Storage

## 📁 Key Files & Directories

```
backend/
├── app/
│   ├── Http/Controllers/    # API controllers
│   ├── Models/             # Eloquent models
│   └── Middleware/         # Custom middleware
├── config/
│   └── sanctum.php         # Sanctum configuration
├── database/
│   ├── migrations/         # Database migrations
│   └── seeders/           # Database seeders
├── routes/
│   ├── api.php            # API routes
│   └── web.php            # Web routes
├── storage/
│   └── app/public/        # File storage
└── Makefile               # Development shortcuts
```

## 🔧 Development Commands

### Using Makefile (Recommended)
```bash
make migrate          # Fresh migration
make seed            # Fresh migration with seeding
make start           # Start Laravel server
make route           # List all routes
make opt             # Optimize application
```

### Using Artisan Directly
```bash
php artisan migrate:fresh --seed
php artisan serve
php artisan route:list
php artisan optimize
```

## 🔐 Authentication Configuration

### Sanctum Configuration
The application is configured for SPA authentication with these domains:
```php
'stateful' => ['localhost', 'localhost:5173', '127.0.0.1', '127.0.0.1:8000', '::1']
```

### Environment Variables
```bash
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

## 🗄️ Database Schema

### Users Table
- id, name, email, role, timestamps
- Roles: 'admin', 'user'

### Categories Table
- id, name, description, timestamps

### Products Table
- id, name, description, price, image, category_id, timestamps
- Foreign key to categories

## 📝 API Documentation

### Authentication Routes
```
POST /api/login          # User login
POST /api/logout         # User logout  
POST /api/register       # User registration
```

### Protected Routes (Requires Authentication)
```
GET    /api/products           # List products
POST   /api/products           # Create product (Admin only)
PUT    /api/products/{id}      # Update product (Admin only)
DELETE /api/products/{id}      # Delete product (Admin only)

GET    /api/categories         # List categories
POST   /api/categories         # Create category (Admin only)
PUT    /api/categories/{id}    # Update category (Admin only)
DELETE /api/categories/{id}    # Delete category (Admin only)

GET    /api/users              # List users (Admin only)
POST   /api/users              # Create user (Admin only)
PUT    /api/users/{id}         # Update user (Admin only)
DELETE /api/users/{id}         # Delete user (Admin only)
```

## 🔒 Security Features

- CSRF token validation
- SQL injection prevention via Eloquent ORM
- XSS protection
- File upload validation
- Request validation
- Rate limiting

## 🚀 Deployment

### Production Setup
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure production database
4. Run `php artisan config:cache`
5. Run `php artisan route:cache`
6. Run `php artisan view:cache`

### File Permissions
```bash
chmod -R 755 storage bootstrap/cache
```

---

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
