package com.ecom.electronics.controller;

import com.ecom.electronics.dto.ApiResponse;
import com.ecom.electronics.dto.AuthRequest;
import com.ecom.electronics.dto.AuthResponse;
import com.ecom.electronics.dto.RegisterRequest;
import com.ecom.electronics.entity.User;
import com.ecom.electronics.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.registerUser(request);
        return new ResponseEntity<>(ApiResponse.ok("Registration successful", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = userService.loginUser(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved", user));
    }
}
