package com.example.ecommerceapp.service;

import com.example.ecommerceapp.dto.request.CartItemRequest;
import com.example.ecommerceapp.dto.response.CartResponse;

public interface CartService {

    CartResponse getCartForUser(String userEmail);

    CartResponse addToCart(String userEmail, CartItemRequest request);

    CartResponse updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity);

    CartResponse removeFromCart(String userEmail, Long cartItemId);

    void clearCart(String userEmail);

}