package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.UpdateOrderStatusRequest;
import com.example.ecommerceapp.dto.response.DashboardStatsResponse;
import com.example.ecommerceapp.dto.response.OrderResponse;
import com.example.ecommerceapp.entity.Order;
import com.example.ecommerceapp.enums.OrderStatus;
import com.example.ecommerceapp.repository.OrderRepository;
import com.example.ecommerceapp.repository.ProductRepository;
import com.example.ecommerceapp.repository.UserRepository;
import com.example.ecommerceapp.service.OrderService;
import com.example.ecommerceapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();

        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PLACED || o.getStatus() == OrderStatus.PROCESSING)
                .count();

        long deliveredOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        DashboardStatsResponse stats = new DashboardStatsResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveredOrders
        );

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Dashboard metrics retrieved successfully", stats)
        );
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All orders retrieved successfully", orders)
        );
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderResponse order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order status updated successfully", order)
        );
    }

}