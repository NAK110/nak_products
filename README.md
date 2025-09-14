
# Project Title

Mini E-commerce Web App

# Description

A full-stack web application with authentication, role-based authentication, and CRUD operations for Users, Categories, and Products. 

The application features secure session-based authentication using Laravel Sanctum, role-based permissions, and user interfaces for both users and admin. 

## Features

**Admin**:
- CRUD Products
- CRUD Categories
- CRUD Users

**Normal User**:
- Can view all products with category filters and search functionalities

## Tech Stack

Built with: 

**For Backend**
- Laravel 12 with PHP 8.4.1
- Database: MySQL 

**For Frontend**
- Vite + React 
- TypeScript 
- TailwindCSS with shadcnUI

## Run Locally

Clone the project

```bash
  git clone https://github.com/NAK110/nak_products
```

Go to the project directory

```bash
  cd nak_products
```

Install dependencies


**For backend**:

```bash
# Navigate to backend folder
cd backend

# run this command
composer install

# Create environment file
cp .env.example .env

# Generate key
php artisan key:generate

#Configure your database in .env file
DB_CONNECTION=mysql
DB_DATABASE=nak_products
DB_USERNAME=root
DB_PASSWORD=

# Include the following in .env:
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

# Create a products folder in storage
cd storage/app/public
mkdir products

# Run migrations
php artisan migrate

# Seed the database
php artisan db:seed

#Start the Laravel server
php artisan serve
```

**For frontend**:

```bash
# Navigate to frontend folder
cd frontend

# run this command
npm install

# Create environment file
.env

# Configure API endpoint in .env
VITE_API_URL=http://localhost:8000/

# Start the development server
npm run dev
```