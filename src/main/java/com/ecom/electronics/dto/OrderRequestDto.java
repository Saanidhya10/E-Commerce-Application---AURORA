package com.ecom.electronics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    public OrderRequestDto() {}

    public OrderRequestDto(Long userId, String shippingAddress, String paymentMethod) {
        this.userId = userId;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
