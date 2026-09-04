package com.example.ecommerceapp.service.impl;

import com.example.ecommerceapp.dto.request.LoginRequest;
import com.example.ecommerceapp.dto.request.RegisterRequest;
import com.example.ecommerceapp.dto.response.AuthResponse;
import com.example.ecommerceapp.entity.User;
import com.example.ecommerceapp.exception.BadRequestException;
import com.example.ecommerceapp.mapper.UserMapper;
import com.example.ecommerceapp.repository.UserRepository;
import com.example.ecommerceapp.security.CustomUserDetails;
import com.example.ecommerceapp.security.JwtService;
import com.example.ecommerceapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check if email is already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Encrypt the password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Convert RegisterRequest to User entity
        User user = userMapper.toEntity(request, encodedPassword);

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(new CustomUserDetails(savedUser));

        // Return authentication response
        return new AuthResponse(
                token,
                "Registration successful",
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        // Find user using email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtService.generateToken(new CustomUserDetails(user));

        // Return authentication response
        return new AuthResponse(
                token,
                "Login successful",
                user.getEmail(),
                user.getRole().name()
        );
    }

}
