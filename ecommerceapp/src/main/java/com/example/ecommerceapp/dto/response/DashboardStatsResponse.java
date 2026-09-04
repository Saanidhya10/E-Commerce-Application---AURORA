package com.example.ecommerceapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalUsers;

    private long totalProducts;

    private long totalOrders;

    private BigDecimal totalRevenue;

    private long pendingOrders;

    private long deliveredOrders;

}
