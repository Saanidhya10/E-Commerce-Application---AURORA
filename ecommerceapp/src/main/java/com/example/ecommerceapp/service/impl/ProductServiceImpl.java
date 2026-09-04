package com.example.ecommerceapp.service.impl;

import com.example.ecommerceapp.dto.request.ProductRequest;
import com.example.ecommerceapp.dto.response.ProductResponse;
import com.example.ecommerceapp.entity.Category;
import com.example.ecommerceapp.entity.Product;
import com.example.ecommerceapp.exception.ResourceNotFoundException;
import com.example.ecommerceapp.mapper.ProductMapper;
import com.example.ecommerceapp.repository.CategoryRepository;
import com.example.ecommerceapp.repository.ProductRepository;
import com.example.ecommerceapp.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductResponse> getAllProducts(Long categoryId, String search) {
        List<Product> products;

        if (categoryId != null && search != null && !search.isBlank()) {
            products = productRepository.findByCategoryIdAndNameContainingIgnoreCaseAndActiveTrue(categoryId, search.trim());
        } else if (categoryId != null) {
            products = productRepository.findByCategoryIdAndActiveTrue(categoryId);
        } else if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseAndActiveTrue(search.trim());
        } else {
            products = productRepository.findByActiveTrue();
        }

        return products.stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = productMapper.toEntity(request, category);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        // Soft delete to maintain order history integrity
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public ProductResponse updateProductStock(Long id, Integer stock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStock(stock);
        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }

}