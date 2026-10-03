package com.ecom.electronics.service;

import com.ecom.electronics.dto.OrderRequestDto;
import com.ecom.electronics.entity.Order;
import com.ecom.electronics.entity.OrderStatus;

import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequestDto orderRequest);
    Order getOrderById(Long orderId);
    Order getOrderByOrderNumber(String orderNumber);
    List<Order> getOrdersByUserId(Long userId);
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, OrderStatus status);
}
