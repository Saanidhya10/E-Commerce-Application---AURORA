package com.ecom.electronics.controller;

import com.ecom.electronics.dto.ApiResponse;
import com.ecom.electronics.dto.OrderRequestDto;
import com.ecom.electronics.entity.Order;
import com.ecom.electronics.entity.OrderStatus;
import com.ecom.electronics.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody OrderRequestDto orderRequest) {
        Order order = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(ApiResponse.ok("Order placed successfully", order), HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", order));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> getOrderByOrderNumber(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", order));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok("User orders retrieved successfully", orders));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok("All orders retrieved successfully", orders));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        Order order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated to " + status, order));
    }
}
