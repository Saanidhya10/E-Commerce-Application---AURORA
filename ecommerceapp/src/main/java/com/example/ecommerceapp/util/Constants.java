package com.example.ecommerceapp.util;

public final class Constants {

    private Constants() {
        // Prevent object creation
    }

    // API Paths
    public static final String API_AUTH = "/api/auth";
    public static final String API_PRODUCTS = "/api/products";
    public static final String API_CATEGORIES = "/api/categories";
    public static final String API_CART = "/api/cart";
    public static final String API_ORDERS = "/api/orders";
    public static final String API_USERS = "/api/users";
    public static final String API_ADMIN = "/api/admin";

    // Messages
    public static final String PRODUCT_NOT_FOUND = "Product not found";
    public static final String CATEGORY_NOT_FOUND = "Category not found";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String ORDER_NOT_FOUND = "Order not found";

    // Authentication Messages
    public static final String LOGIN_SUCCESS = "Login successful";
    public static final String REGISTRATION_SUCCESS = "Registration successful";
    public static final String INVALID_CREDENTIALS = "Invalid email or password";

    // General Messages
    public static final String SUCCESS = "Success";
    public static final String FAILED = "Failed";

}