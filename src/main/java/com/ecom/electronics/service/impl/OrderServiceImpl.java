package com.ecom.electronics.service.impl;

import com.ecom.electronics.dto.OrderRequestDto;
import com.ecom.electronics.entity.*;
import com.ecom.electronics.exception.BadRequestException;
import com.ecom.electronics.exception.ResourceNotFoundException;
import com.ecom.electronics.repository.CartRepository;
import com.ecom.electronics.repository.OrderRepository;
import com.ecom.electronics.repository.ProductRepository;
import com.ecom.electronics.repository.UserRepository;
import com.ecom.electronics.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, CartRepository cartRepository,
                            UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public Order createOrder(OrderRequestDto orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + orderRequest.getUserId()));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Shopping cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create order from empty cart");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        String orderNum = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        Order order = new Order(
                orderNum,
                user,
                orderRequest.getShippingAddress(),
                orderRequest.getPaymentMethod(),
                BigDecimal.ZERO,
                OrderStatus.PROCESSING
        );

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Product '" + product.getName() + "' does not have sufficient stock");
            }

            // Deduct stock quantity
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    cartItem.getUnitPrice(),
                    cartItem.getQuantity(),
                    subtotal
            );
            order.addOrderItem(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear user cart after successful order creation
        cart.clearItems();
        cartRepository.save(cart);

        return savedOrder;
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    @Override
    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
