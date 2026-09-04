# 🛍️ AURORA — Full-Stack E-Commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**AURORA** is a modern, enterprise-ready full-stack e-commerce web application. Built with a robust **Java Spring Boot** RESTful API backend and a sleek **React + Vite** frontend with the custom **Aurora Glassmorphic Design System**, this platform provides an end-to-end shopping journey with Indian market localization (INR pricing, UPI/RuPay/COD payments, and address management).

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Curated Catalog & Precision Browsing**: Dynamic search with debouncing, category pills (Electronics, Fashion, Home & Living, Sports, Books), and real-time inventory tracking.
- **Product Detail Quick-View**: High-resolution imagery, technical specifications, warranty badges, and interactive quantity selectors.
- **Slide-Over Shopping Bag**: Persistent cart drawer with live stock validation, item quantity controls (+/-), and instant subtotal calculations.
- **Express Indian Checkout**:
  - **Pan-India Address Management**: Add and select delivery addresses with Indian PIN codes, states, and phone number formatting.
  - **Multiple Payment Options**: Instant UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (RuPay, Visa, Mastercard), and Cash on Delivery (COD).
  - **Instant Order Confirmation**: Live tracking receipt with order ID, date, payment status, and delivery breakdown.
- **Order History**: Dedicated orders dashboard tracking order lifecycle states (`PLACED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

### 🛡️ Admin Operations Portal
- **Executive Analytics**: Real-time business metrics displaying Total Revenue (₹), Total Orders, Pending Orders, Catalog Volume, and Registered Users.
- **Live Order Management**: Change customer order fulfillment statuses on the fly.
- **Catalog Management**: Add, price, and publish new products with instant category mapping and stock allocation.

### 🔐 Security & Architecture
- **Stateless JWT Authentication**: Secure Spring Security filter chain with signed `Bearer` tokens and BCrypt password encryption.
- **Role-Based Access Control (RBAC)**: Enforced segregation between `CUSTOMER` and `ADMIN` APIs.
- **Zero-Config Developer Experience**: Persistent local database by default for immediate plug-and-play onboarding, with seamless environment variable support for production **MySQL**.
- **Cross-Origin Resource Sharing (CORS)**: Pre-configured for dev server reverse proxying and decoupled multi-domain deployments.

---

## 🏗️ Project Architecture

```
ecommerceapp/
├── ecommerceapp/                 # Java Spring Boot Backend
│   ├── src/main/java/com/example/ecommerceapp/
│   │   ├── config/              # Security, CORS & Data Initializer
│   │   ├── controller/          # REST Endpoints (Products, Orders, Cart, Admin)
│   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   ├── entity/              # JPA Database Entities (Product, Order, User, etc.)
│   │   ├── enums/               # Status & Role Enums
│   │   ├── exception/           # Global Exception Handlers
│   │   ├── mapper/              # Entity-DTO Mappers
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   ├── security/            # JWT Filters, Token Services, UserDetails
│   │   └── service/             # Business Logic & Implementations
│   └── src/main/resources/      # Application & Database Properties
│
└── frontend/                     # React + Vite Frontend
    ├── src/
    │   ├── api/                 # API client & HTTP service wrappers
    │   ├── components/          # Reusable UI components (Navbar, Cart, Hero, Admin)
    │   ├── context/             # AuthContext, CartContext, ToastContext
    │   ├── utils/               # Currency & String formatting utilities
    │   ├── index.css            # Aurora Design System & Design Tokens
    │   ├── App.jsx              # Main Application Orchestrator
    │   └── main.jsx             # React Root & Context Providers
    ├── index.html
    └── vite.config.js           # Vite dev server & proxy settings
```

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Vanilla CSS Aurora Design System, Lucide React Icons |
| **Backend** | Java 17+, Spring Boot, Spring Security 6/7, Spring Data JPA, Hibernate |
| **Authentication** | JSON Web Tokens (JWT), BCrypt, Spring Security Filter Chain |
| **Database** | Persistent Local H2 Database / MySQL 8.0+ |
| **Build & Tooling** | Maven (`./mvnw`), Node.js, npm, Docker |

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher (LTS recommended)
- **Git**

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd ecommerceapp

# Build and package the backend application
./mvnw clean package -DskipTests=true

# Launch the Spring Boot application
java -jar target/ecommerceapp-0.0.1-SNAPSHOT.jar
```
> The backend server starts on **`http://localhost:8080`**.
> It automatically seeds default categories, Indian Rupee products, sample customer address, and demo accounts on first boot.

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory in a new terminal
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
> The frontend application launches on **`http://localhost:3000`** with automatic `/api` proxying to `http://localhost:8080`.

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Customer (India)** | `customer@ecommerce.com` | `Customer@123` | Browsing, Cart drawer, Bengaluru Address, UPI / RuPay / COD Checkout, Order History |
| **Admin (India)** | `admin@ecommerce.com` | `Admin@123` | Real-time Revenue Dashboard, Orders Management, Order Status Updater, Add Products |

> 💡 **Tip**: Click **Sign In** in the navbar and use the **Instant One-Click Demo Access** buttons to log in with a single click.

---

## 📡 REST API Reference Overview

| HTTP Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/products` | Public | Retrieve product catalog (with search & category filters) |
| `GET` | `/api/categories` | Public | Retrieve all product categories |
| `GET` | `/api/cart` | Customer | Fetch current user's active shopping cart |
| `POST` | `/api/cart/items` | Customer | Add product to shopping cart |
| `PUT` | `/api/cart/items/{id}` | Customer | Update item quantity in cart |
| `DELETE` | `/api/cart/items/{id}` | Customer | Remove product from cart |
| `POST` | `/api/orders` | Customer | Checkout active cart & generate order |
| `GET` | `/api/orders` | Customer | Fetch user's past order history |
| `GET` | `/api/admin/dashboard` | Admin | Retrieve real-time platform revenue & metrics |
| `PUT` | `/api/admin/orders/{id}/status` | Admin | Update order processing & delivery status |
| `POST` | `/api/products` | Admin | Create and publish a new product |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
