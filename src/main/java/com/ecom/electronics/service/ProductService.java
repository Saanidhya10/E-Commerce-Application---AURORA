package com.ecom.electronics.service;

import com.ecom.electronics.dto.ProductDto;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();
    List<ProductDto> getFeaturedProducts();
    List<ProductDto> getProductsByCategory(Long categoryId);
    List<ProductDto> searchProducts(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice);
    ProductDto getProductById(Long id);
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);
}
