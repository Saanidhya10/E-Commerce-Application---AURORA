package com.ecom.electronics.controller;

import com.ecom.electronics.dto.ApiResponse;
import com.ecom.electronics.service.CategoryService;
import com.ecom.electronics.service.OrderService;
import com.ecom.electronics.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;

    public AdminController(ProductService productService, CategoryService categoryService, OrderService orderService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productService.getAllProducts().size());
        stats.put("totalCategories", categoryService.getAllCategories().size());
        stats.put("totalOrders", orderService.getAllOrders().size());
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard metrics", stats));
    }
}
