package com.example.ecommerceapp.service;

import com.example.ecommerceapp.dto.request.LoginRequest;
import com.example.ecommerceapp.dto.request.RegisterRequest;
import com.example.ecommerceapp.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}