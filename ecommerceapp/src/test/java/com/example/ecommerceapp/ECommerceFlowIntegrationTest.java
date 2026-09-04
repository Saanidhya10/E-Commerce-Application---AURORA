package com.example.ecommerceapp;

import com.example.ecommerceapp.controller.*;
import com.example.ecommerceapp.dto.request.*;
import com.example.ecommerceapp.dto.response.*;
import com.example.ecommerceapp.enums.OrderStatus;
import com.example.ecommerceapp.util.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ECommerceFlowIntegrationTest {

    @Autowired
    private AuthController authController;

    @Autowired
    private ProductController productController;

    @Autowired
    private CategoryController categoryController;

    @Autowired
    private CartController cartController;

    @Autowired
    private OrderController orderController;

    @Autowired
    private AddressController addressController;

    @Autowired
    private AdminController adminController;

    @Test
    void testCompleteECommerceFlow() {
        // 1. Verify categories and products are seeded
        ResponseEntity<ApiResponse<List<CategoryResponse>>> categoriesResp = categoryController.getAllCategories();
        assertEquals(HttpStatus.OK, categoriesResp.getStatusCode());
        assertNotNull(categoriesResp.getBody());
        List<CategoryResponse> categories = categoriesResp.getBody().getData();
        assertFalse(categories.isEmpty(), "Categories should be seeded");

        ResponseEntity<ApiResponse<List<ProductResponse>>> productsResp = productController.getAllProducts(null, null);
        assertEquals(HttpStatus.OK, productsResp.getStatusCode());
        assertNotNull(productsResp.getBody());
        List<ProductResponse> products = productsResp.getBody().getData();
        assertFalse(products.isEmpty(), "Products should be seeded");

        ProductResponse firstProduct = products.get(0);
        int initialStock = firstProduct.getStock();

        // 2. Customer login
        LoginRequest customerLogin = new LoginRequest("customer@ecommerce.com", "Customer@123");
        ResponseEntity<ApiResponse<AuthResponse>> loginResp = authController.login(customerLogin);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
        assertNotNull(loginResp.getBody());
        String token = loginResp.getBody().getData().getToken();
        assertNotNull(token);

        Principal customerPrincipal = () -> "customer@ecommerce.com";

        // 3. User checks addresses
        ResponseEntity<ApiResponse<List<AddressResponse>>> addressesResp = addressController.getUserAddresses(customerPrincipal);
        assertEquals(HttpStatus.OK, addressesResp.getStatusCode());
        assertNotNull(addressesResp.getBody());
        assertFalse(addressesResp.getBody().getData().isEmpty(), "Sample address should be seeded");
        Long addressId = addressesResp.getBody().getData().get(0).getId();

        // 4. Add product to cart
        CartItemRequest cartItemReq = new CartItemRequest(firstProduct.getId(), 2);
        ResponseEntity<ApiResponse<CartResponse>> cartResp = cartController.addToCart(customerPrincipal, cartItemReq);
        assertEquals(HttpStatus.OK, cartResp.getStatusCode());
        assertNotNull(cartResp.getBody());
        assertEquals(1, cartResp.getBody().getData().getItems().size());
        assertEquals(2, cartResp.getBody().getData().getItems().get(0).getQuantity());

        // 5. Checkout & place order
        OrderRequest orderReq = new OrderRequest(addressId, "CARD");
        ResponseEntity<ApiResponse<OrderResponse>> orderResp = orderController.createOrder(customerPrincipal, orderReq);
        assertEquals(HttpStatus.OK, orderResp.getStatusCode());
        assertNotNull(orderResp.getBody());
        OrderResponse placedOrder = orderResp.getBody().getData();
        assertEquals("PLACED", placedOrder.getStatus());
        assertEquals("SUCCESS", placedOrder.getPaymentStatus());

        // 6. Verify cart is empty after checkout
        ResponseEntity<ApiResponse<CartResponse>> emptyCartResp = cartController.getCart(customerPrincipal);
        assertEquals(HttpStatus.OK, emptyCartResp.getStatusCode());
        assertNotNull(emptyCartResp.getBody());
        assertTrue(emptyCartResp.getBody().getData().getItems().isEmpty());

        // 7. Verify inventory stock was decremented
        ResponseEntity<ApiResponse<ProductResponse>> updatedProductResp = productController.getProductById(firstProduct.getId());
        assertEquals(HttpStatus.OK, updatedProductResp.getStatusCode());
        assertNotNull(updatedProductResp.getBody());
        assertEquals(initialStock - 2, updatedProductResp.getBody().getData().getStock());

        // 8. Verify order history
        ResponseEntity<ApiResponse<List<OrderResponse>>> userOrdersResp = orderController.getUserOrders(customerPrincipal);
        assertEquals(HttpStatus.OK, userOrdersResp.getStatusCode());
        assertNotNull(userOrdersResp.getBody());
        assertFalse(userOrdersResp.getBody().getData().isEmpty());

        // 9. Admin checks dashboard stats
        ResponseEntity<ApiResponse<DashboardStatsResponse>> statsResp = adminController.getDashboardStats();
        assertEquals(HttpStatus.OK, statsResp.getStatusCode());
        assertNotNull(statsResp.getBody());
        assertTrue(statsResp.getBody().getData().getTotalOrders() >= 1);
        assertTrue(statsResp.getBody().getData().getTotalProducts() >= 10);

        // 10. Admin updates order status to SHIPPED
        UpdateOrderStatusRequest updateReq = new UpdateOrderStatusRequest(OrderStatus.SHIPPED);
        ResponseEntity<ApiResponse<OrderResponse>> updatedOrderResp = adminController.updateOrderStatus(placedOrder.getOrderId(), updateReq);
        assertEquals(HttpStatus.OK, updatedOrderResp.getStatusCode());
        assertNotNull(updatedOrderResp.getBody());
        assertEquals("SHIPPED", updatedOrderResp.getBody().getData().getStatus());
    }

}
