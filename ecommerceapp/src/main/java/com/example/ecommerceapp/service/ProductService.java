package com.example.ecommerceapp.service;

import com.example.ecommerceapp.dto.request.ProductRequest;
import com.example.ecommerceapp.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts(Long categoryId, String search);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    ProductResponse updateProductStock(Long id, Integer stock);

}