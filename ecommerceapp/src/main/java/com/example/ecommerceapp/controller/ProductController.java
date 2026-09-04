package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.ProductRequest;
import com.example.ecommerceapp.dto.response.ProductResponse;
import com.example.ecommerceapp.service.ProductService;
import com.example.ecommerceapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        List<ProductResponse> products = productService.getAllProducts(categoryId, search);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Products retrieved successfully", products)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product retrieved successfully", product)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product created successfully", product)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request
    ) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product updated successfully", product)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product deleted successfully", null)
        );
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponse>> updateStock(
            @PathVariable Long id,
            @RequestParam Integer stock
    ) {
        ProductResponse product = productService.updateProductStock(id, stock);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product stock updated successfully", product)
        );
    }

}