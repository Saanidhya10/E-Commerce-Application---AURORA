package com.example.ecommerceapp.repository;

import com.example.ecommerceapp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByActiveTrue();

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);

    List<Product> findByCategoryIdAndNameContainingIgnoreCaseAndActiveTrue(Long categoryId, String name);

    long countByActiveTrue();

}