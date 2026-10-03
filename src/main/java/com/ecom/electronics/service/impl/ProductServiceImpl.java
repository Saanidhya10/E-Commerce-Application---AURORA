package com.ecom.electronics.service.impl;

import com.ecom.electronics.dto.ProductDto;
import com.ecom.electronics.entity.Category;
import com.ecom.electronics.entity.Product;
import com.ecom.electronics.exception.ResourceNotFoundException;
import com.ecom.electronics.repository.CategoryRepository;
import com.ecom.electronics.repository.ProductRepository;
import com.ecom.electronics.service.ProductService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProducts(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return productRepository.searchProducts(cleanQuery, categoryId, minPrice, maxPrice).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));

        Product product = new Product(
                productDto.getName(),
                productDto.getBrand(),
                productDto.getDescription(),
                productDto.getPrice(),
                productDto.getOldPrice(),
                productDto.getStockQuantity(),
                productDto.getFeatured() != null ? productDto.getFeatured() : false,
                productDto.getImageUrl(),
                category
        );

        if (productDto.getRating() != null) product.setRating(productDto.getRating());
        if (productDto.getReviewCount() != null) product.setReviewCount(productDto.getReviewCount());

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));

        product.setName(productDto.getName());
        product.setBrand(productDto.getBrand());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setOldPrice(productDto.getOldPrice());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setFeatured(productDto.getFeatured());
        if (productDto.getImageUrl() != null) product.setImageUrl(productDto.getImageUrl());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);
        return mapToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOldPrice(product.getOldPrice());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setInStock(product.getInStock());
        dto.setFeatured(product.getFeatured());
        dto.setImageUrl(product.getImageUrl());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        return dto;
    }
}
