package com.ecom.electronics.service;

import com.ecom.electronics.entity.Cart;

public interface CartService {
    Cart getCartByUserId(Long userId);
    Cart addItemToCart(Long userId, Long productId, Integer quantity);
    Cart updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity);
    Cart removeItemFromCart(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
