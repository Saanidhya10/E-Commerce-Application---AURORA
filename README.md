# TechMart Electronics - Production E-Commerce Full-Stack Project

A full-stack, interview-ready e-commerce web application built using **Spring Boot 3**, **Java 17**, **JPA / Hibernate**, **MySQL Database**, **REST APIs**, and **Vanilla HTML5 / CSS3 / JavaScript**.

---

## 🌟 Key Project Highlights

- **Clean Real-World Design**: Designed specifically to resemble standard, production-grade e-commerce applications (Amazon / BestBuy / B&H style) rather than AI-generated or flashy portfolio demos.
- **Spring Boot REST Architecture**: Layered enterprise architecture following clean separation of concerns (`Controller` -> `Service` -> `Repository` -> `Entity` -> `DTO`).
- **Relational MySQL Integration**: Full JPA/Hibernate mappings (`@Entity`, `@Table`, `@OneToMany`, `@ManyToOne`, `@OneToOne`) with complete `schema.sql` and `data.sql` scripts.
- **Postman Ready**: Pre-configured Postman Collection provided in `postman/Ecom_Electronics_API.postman_collection.json` covering all REST endpoints for direct live demonstration in interviews.
- **Dual Connection Mode**: Frontend automatically connects to the live Spring Boot REST API server on port 8080. If backend is not started, it operates smoothly in standalone mode.

---

## 📁 Project Architecture & File Structure

```
Ecom- Electronics/
├── pom.xml                                   # Spring Boot Maven dependencies & build configuration
├── src/
│   ├── main/
│   │   ├── java/com/ecom/electronics/
│   │   │   ├── EcomElectronicsApplication.java # Spring Boot Main Entry Point
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java           # Cross-Origin Resource Sharing settings
│   │   │   │   └── DatabaseInitializer.java  # Auto seed runner for demo data
│   │   │   ├── controller/                   # REST API Controllers (@RestController)
│   │   │   │   ├── AuthController.java       # User authentication & registration
│   │   │   │   ├── CategoryController.java   # Category management endpoints
│   │   │   │   ├── ProductController.java    # Product CRUD & search endpoints
│   │   │   │   ├── CartController.java       # Cart management endpoints
│   │   │   │   ├── OrderController.java      # Order processing endpoints
│   │   │   │   └── AdminController.java      # Admin dashboard statistics
│   │   │   ├── dto/                          # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── ProductDto.java
│   │   │   │   ├── OrderRequestDto.java
│   │   │   │   └── ApiResponse.java          # Standardized API response wrapper
│   │   │   ├── entity/                       # JPA Database Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── Cart.java & CartItem.java
│   │   │   │   ├── Order.java & OrderItem.java
│   │   │   │   ├── Role.java (Enum)
│   │   │   │   └── OrderStatus.java (Enum)
│   │   │   ├── exception/                    # Global Exception Handling (@RestControllerAdvice)
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── BadRequestException.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── repository/                   # Spring Data JPA Interfaces
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── CartRepository.java
│   │   │   │   └── OrderRepository.java
│   │   │   └── service/                      # Business Logic Services & Implementations
│   │   │       ├── UserService.java & UserServiceImpl.java
│   │   │       ├── ProductService.java & ProductServiceImpl.java
│   │   │       ├── CategoryService.java & CategoryServiceImpl.java
│   │   │       ├── CartService.java & CartServiceImpl.java
│   │   │       └── OrderService.java & OrderServiceImpl.java
│   │   └── resources/
│   │       ├── application.properties        # MySQL DB credentials & JPA properties
│   │       ├── schema.sql                    # MySQL Database Schema DDL
│   │       └── data.sql                      # Initial MySQL seed data
├── index.html                                # E-Commerce Web Application Interface
├── style.css                                 # Professional non-AI styling
├── js/
│   ├── api.js                                # REST API Client Module
│   ├── app.js                                # Frontend Controller & UI Renderer
│   └── data.js                               # Initial dataset state
├── img/                                      # Realistic Product Images
├── postman/
│   └── Ecom_Electronics_API.postman_collection.json # Production Postman API Collection
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Spring Boot 3.2.3, Java 17 |
| **ORM / Persistence** | JPA / Hibernate, Spring Data JPA |
| **Database** | MySQL (with H2 console fallback for dev testing) |
| **Validation & Error Handling** | Jakarta Validation, `@RestControllerAdvice` |
| **API Testing** | Postman v2.1 Collection |
| **Frontend** | HTML5, Modern CSS3 (Vanilla), JavaScript (ES6 Modules) |

---

## 🚀 How to Run the Backend (Spring Boot)

### Prerequisites
- JDK 17 or higher
- Maven 3.x
- MySQL Server running on `localhost:3006` with database name `ecom_electronics_db` (or user `root` / password `root`).

### Command Line Execution
```bash
# 1. Clone or navigate to project folder
cd "c:/MyFiles/Git Project/Ecom- Electronics"

# 2. Build and run Spring Boot Application
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.

---

## 📮 REST API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user account
- `POST /api/v1/auth/login` - Authenticate user & get session token
- `GET /api/v1/auth/me/{userId}` - Get current user profile

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get product by ID
- `GET /api/v1/products/search?query=laptop&minPrice=500` - Search & filter products
- `POST /api/v1/products` - Create new product (Admin)
- `PUT /api/v1/products/{id}` - Update product details (Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category

### Cart
- `GET /api/v1/cart/{userId}` - Get user active cart
- `POST /api/v1/cart/{userId}/add?productId=1&quantity=1` - Add item to cart
- `PUT /api/v1/cart/{userId}/items/{cartItemId}?quantity=2` - Update item quantity
- `DELETE /api/v1/cart/{userId}/items/{cartItemId}` - Remove item from cart

### Orders
- `POST /api/v1/orders` - Place order from cart items
- `GET /api/v1/orders/user/{userId}` - Get user order history
- `GET /api/v1/orders/{orderId}` - Get order details
- `PATCH /api/v1/orders/{orderId}/status?status=SHIPPED` - Update order status (Admin)

---

## 🧪 Testing with Postman

1. Open Postman.
2. Click **Import** -> Select `postman/Ecom_Electronics_API.postman_collection.json`.
3. Collection variable `baseUrl` is set to `http://localhost:8080`.
4. Execute endpoints across Auth, Products, Categories, Cart, Orders, and Admin folders.

---

## 🎨 UI & UX Design Highlights

- **Standard E-Commerce Header**: Utility bar, search box with category selector, cart badge, and user dropdown.
- **Filter Toolbar & Sidebar**: Interactive price slider, stock filters, brand filters, and instant sorting (Low to High, High to Low, Rating).
- **Cart & Checkout Modal**: Line item calculations, shipping calculation, tax preview, and instant database submission.
- **Admin Management Console**: Product catalog CRUD operations (Add, Edit, Delete products with live table update).

---

## 📝 License & Purpose
Built for real-world software engineering interview demonstrations. Clean, modular, and easy to present.
