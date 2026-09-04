package com.example.ecommerceapp.service;

import com.example.ecommerceapp.dto.request.OrderRequest;
import com.example.ecommerceapp.dto.request.UpdateOrderStatusRequest;
import com.example.ecommerceapp.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(String userEmail, OrderRequest request);

    List<OrderResponse> getUserOrders(String userEmail);

    OrderResponse getOrderById(String userEmail, Long orderId);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);

}