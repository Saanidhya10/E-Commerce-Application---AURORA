package com.example.ecommerceapp.mapper;

import com.example.ecommerceapp.dto.response.OrderItemResponse;
import com.example.ecommerceapp.dto.response.OrderResponse;
import com.example.ecommerceapp.entity.Order;
import com.example.ecommerceapp.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemResponse> items = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                        .map(this::toOrderItemResponse)
                        .toList()
                : Collections.emptyList();

        String paymentStatus = null;
        if (order.getPayment() != null && order.getPayment().getStatus() != null) {
            paymentStatus = order.getPayment().getStatus().name();
        }

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getStatus() != null ? order.getStatus().name() : null,
                order.getTotalAmount(),
                items,
                paymentStatus
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        BigDecimal price = orderItem.getPrice() != null ? orderItem.getPrice() : BigDecimal.ZERO;
        int qty = orderItem.getQuantity() != null ? orderItem.getQuantity() : 0;
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(qty));

        Long productId = orderItem.getProduct() != null ? orderItem.getProduct().getId() : null;
        String productName = orderItem.getProduct() != null ? orderItem.getProduct().getName() : null;

        return new OrderItemResponse(
                productId,
                productName,
                price,
                qty,
                subtotal
        );
    }

}