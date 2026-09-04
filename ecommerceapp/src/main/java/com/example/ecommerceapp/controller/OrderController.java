package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.OrderRequest;
import com.example.ecommerceapp.dto.response.OrderResponse;
import com.example.ecommerceapp.service.OrderService;
import com.example.ecommerceapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            Principal principal,
            @RequestBody OrderRequest request
    ) {
        OrderResponse order = orderService.createOrder(principal.getName(), request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order placed successfully", order)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(Principal principal) {
        List<OrderResponse> orders = orderService.getUserOrders(principal.getName());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved successfully", orders)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            Principal principal,
            @PathVariable Long id
    ) {
        OrderResponse order = orderService.getOrderById(principal.getName(), id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order details retrieved successfully", order)
        );
    }

}