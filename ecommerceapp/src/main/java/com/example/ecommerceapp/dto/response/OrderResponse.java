package com.example.ecommerceapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;

    private LocalDateTime orderDate;

    private String status;

    private BigDecimal totalAmount;

    private List<OrderItemResponse> items;

    private String paymentStatus;

}