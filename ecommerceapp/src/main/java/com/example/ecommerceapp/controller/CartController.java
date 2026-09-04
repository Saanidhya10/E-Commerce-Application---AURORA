package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.CartItemRequest;
import com.example.ecommerceapp.dto.response.CartResponse;
import com.example.ecommerceapp.service.CartService;
import com.example.ecommerceapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Principal principal) {
        CartResponse cart = cartService.getCartForUser(principal.getName());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Cart retrieved successfully", cart)
        );
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Principal principal,
            @RequestBody CartItemRequest request
    ) {
        CartResponse cart = cartService.addToCart(principal.getName(), request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Item added to cart", cart)
        );
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            Principal principal,
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        CartResponse cart = cartService.updateCartItemQuantity(principal.getName(), itemId, quantity);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Cart item updated", cart)
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            Principal principal,
            @PathVariable Long itemId
    ) {
        CartResponse cart = cartService.removeFromCart(principal.getName(), itemId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Item removed from cart", cart)
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Cart cleared successfully", null)
        );
    }

}