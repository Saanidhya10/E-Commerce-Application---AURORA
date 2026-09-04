package com.example.ecommerceapp.service.impl;

import com.example.ecommerceapp.dto.request.OrderRequest;
import com.example.ecommerceapp.dto.request.UpdateOrderStatusRequest;
import com.example.ecommerceapp.dto.response.OrderResponse;
import com.example.ecommerceapp.entity.*;
import com.example.ecommerceapp.enums.OrderStatus;
import com.example.ecommerceapp.enums.PaymentStatus;
import com.example.ecommerceapp.enums.RoleType;
import com.example.ecommerceapp.exception.BadRequestException;
import com.example.ecommerceapp.exception.ResourceNotFoundException;
import com.example.ecommerceapp.exception.UnauthorizedException;
import com.example.ecommerceapp.mapper.OrderMapper;
import com.example.ecommerceapp.repository.*;
import com.example.ecommerceapp.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse createOrder(String userEmail, OrderRequest request) {
        User user = getUserByEmail(userEmail);

        Address shippingAddress = null;
        if (request.getAddressId() != null) {
            shippingAddress = addressRepository.findByIdAndUserId(request.getAddressId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found with id: " + request.getAddressId()));
        } else {
            List<Address> userAddresses = addressRepository.findByUserId(user.getId());
            if (!userAddresses.isEmpty()) {
                shippingAddress = userAddresses.get(0);
            }
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("No cart found for user"));

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot create order with an empty cart");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);
        order.setOrderItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            if (!Boolean.TRUE.equals(product.getActive())) {
                throw new BadRequestException("Product is no longer available: " + product.getName());
            }

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName() + ". Available: " + product.getStock());
            }

            // Deduct stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            BigDecimal lineSubtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(lineSubtotal);

            order.getOrderItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        // Create Payment record
        String paymentMethod = (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank())
                ? request.getPaymentMethod().toUpperCase()
                : "COD";

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus("COD".equalsIgnoreCase(paymentMethod) ? PaymentStatus.PENDING : PaymentStatus.SUCCESS);
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPaymentDate(LocalDateTime.now());
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = getUserByEmail(userEmail);
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId()).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != RoleType.ADMIN) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(request.getStatus());

        if (request.getStatus() == OrderStatus.DELIVERED && order.getPayment() != null) {
            order.getPayment().setStatus(PaymentStatus.SUCCESS);
        } else if (request.getStatus() == OrderStatus.CANCELLED && order.getPayment() != null) {
            order.getPayment().setStatus(PaymentStatus.REFUNDED);
        }

        Order updated = orderRepository.save(order);
        return orderMapper.toResponse(updated);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

}