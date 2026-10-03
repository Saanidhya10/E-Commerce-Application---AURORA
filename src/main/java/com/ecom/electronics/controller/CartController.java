package com.ecom.electronics.controller;

import com.ecom.electronics.dto.ApiResponse;
import com.ecom.electronics.entity.Cart;
import com.ecom.electronics.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<Cart>> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok("Cart retrieved successfully", cart));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<ApiResponse<Cart>> addItem(
            @PathVariable Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity
    ) {
        Cart cart = cartService.addItemToCart(userId, productId, quantity);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PutMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<ApiResponse<Cart>> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity
    ) {
        Cart cart = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
        return ResponseEntity.ok(ApiResponse.ok("Cart item quantity updated", cart));
    }

    @DeleteMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<ApiResponse<Cart>> removeItem(
            @PathVariable Long userId,
            @PathVariable Long cartItemId
    ) {
        Cart cart = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared successfully", null));
    }
}
