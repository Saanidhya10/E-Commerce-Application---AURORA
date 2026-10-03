package com.ecom.electronics.service;

import com.ecom.electronics.dto.AuthRequest;
import com.ecom.electronics.dto.AuthResponse;
import com.ecom.electronics.dto.RegisterRequest;
import com.ecom.electronics.entity.User;

public interface UserService {
    AuthResponse registerUser(RegisterRequest request);
    AuthResponse loginUser(AuthRequest request);
    User getUserById(Long userId);
}
