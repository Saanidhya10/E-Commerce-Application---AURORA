package com.example.ecommerceapp.repository;

import com.example.ecommerceapp.entity.Order;
import com.example.ecommerceapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findAllByOrderByOrderDateDesc();

    Optional<Order> findByIdAndUserId(Long id, Long userId);

}