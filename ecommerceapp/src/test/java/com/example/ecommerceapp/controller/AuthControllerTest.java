package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.LoginRequest;
import com.example.ecommerceapp.dto.request.RegisterRequest;
import com.example.ecommerceapp.dto.response.AuthResponse;
import com.example.ecommerceapp.util.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthControllerTest {

    @Autowired
    private AuthController authController;

    @Test
    void testRegisterAndLoginFlow() {
        // 1. Register a new user
        RegisterRequest registerRequest = new RegisterRequest("Test User", "testuser@example.com", "Password@123");
        ResponseEntity<ApiResponse<AuthResponse>> registerResponse = authController.register(registerRequest);

        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());
        assertNotNull(registerResponse.getBody());
        assertTrue(registerResponse.getBody().isSuccess());
        assertNotNull(registerResponse.getBody().getData().getToken());
        assertEquals("testuser@example.com", registerResponse.getBody().getData().getEmail());
        assertEquals("CUSTOMER", registerResponse.getBody().getData().getRole());

        // 2. Login with registered credentials
        LoginRequest loginRequest = new LoginRequest("testuser@example.com", "Password@123");
        ResponseEntity<ApiResponse<AuthResponse>> loginResponse = authController.login(loginRequest);

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
        assertNotNull(loginResponse.getBody());
        assertTrue(loginResponse.getBody().isSuccess());
        assertNotNull(loginResponse.getBody().getData().getToken());
        assertEquals("testuser@example.com", loginResponse.getBody().getData().getEmail());
    }

}
