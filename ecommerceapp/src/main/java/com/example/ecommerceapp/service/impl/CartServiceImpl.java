package com.example.ecommerceapp.service.impl;

import com.example.ecommerceapp.dto.request.CartItemRequest;
import com.example.ecommerceapp.dto.response.CartItemResponse;
import com.example.ecommerceapp.dto.response.CartResponse;
import com.example.ecommerceapp.entity.Cart;
import com.example.ecommerceapp.entity.CartItem;
import com.example.ecommerceapp.entity.Product;
import com.example.ecommerceapp.entity.User;
import com.example.ecommerceapp.exception.BadRequestException;
import com.example.ecommerceapp.exception.ResourceNotFoundException;
import com.example.ecommerceapp.repository.CartItemRepository;
import com.example.ecommerceapp.repository.CartRepository;
import com.example.ecommerceapp.repository.ProductRepository;
import com.example.ecommerceapp.repository.UserRepository;
import com.example.ecommerceapp.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CartResponse getCartForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(String userEmail, CartItemRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }

        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new BadRequestException("Product is currently unavailable");
        }

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        int totalRequestedQty = request.getQuantity();
        if (existingItem.isPresent()) {
            totalRequestedQty += existingItem.get().getQuantity();
        }

        if (product.getStock() < totalRequestedQty) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
        }

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(totalRequestedQty);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getCartItems().add(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getCartItems().stream()
                .filter(ci -> ci.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (quantity == null || quantity <= 0) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStock() < quantity) {
                throw new BadRequestException("Insufficient stock. Available: " + item.getProduct().getStock());
            }
            item.setQuantity(quantity);
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(String userEmail, Long cartItemId) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getCartItems().stream()
                .filter(ci -> ci.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setCartItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems().stream().map(item -> {
            BigDecimal price = item.getProduct().getPrice() != null ? item.getProduct().getPrice() : BigDecimal.ZERO;
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

            return new CartItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    price,
                    item.getQuantity(),
                    subtotal
            );
        }).toList();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                cart.getUser().getId(),
                items,
                totalAmount
        );
    }

}