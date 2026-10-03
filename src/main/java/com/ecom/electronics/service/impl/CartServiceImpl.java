package com.ecom.electronics.service.impl;

import com.ecom.electronics.entity.Cart;
import com.ecom.electronics.entity.CartItem;
import com.ecom.electronics.entity.Product;
import com.ecom.electronics.entity.User;
import com.ecom.electronics.exception.BadRequestException;
import com.ecom.electronics.exception.ResourceNotFoundException;
import com.ecom.electronics.repository.CartRepository;
import com.ecom.electronics.repository.ProductRepository;
import com.ecom.electronics.repository.UserRepository;
import com.ecom.electronics.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    @Transactional
    public Cart addItemToCart(Long userId, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }

        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStockQuantity() + ")");
        }

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQty = existingItem.getQuantity() + quantity;
            if (product.getStockQuantity() < newQty) {
                throw new BadRequestException("Cannot add more. Total in cart would exceed available stock.");
            }
            existingItem.setQuantity(newQty);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity, product.getPrice());
            cart.addItem(newItem);
        }

        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (quantity <= 0) {
            cart.removeItem(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new BadRequestException("Quantity exceeds available stock");
            }
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = getCartByUserId(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        cart.removeItem(item);
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.clearItems();
        cartRepository.save(cart);
    }
}
