package com.ecom.electronics.service.impl;

import com.ecom.electronics.dto.AuthRequest;
import com.ecom.electronics.dto.AuthResponse;
import com.ecom.electronics.dto.RegisterRequest;
import com.ecom.electronics.entity.Cart;
import com.ecom.electronics.entity.Role;
import com.ecom.electronics.entity.User;
import com.ecom.electronics.exception.BadRequestException;
import com.ecom.electronics.exception.ResourceNotFoundException;
import com.ecom.electronics.repository.CartRepository;
import com.ecom.electronics.repository.UserRepository;
import com.ecom.electronics.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public UserServiceImpl(UserRepository userRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getPassword(), // In production, use BCryptPasswordEncoder
                request.getPhone(),
                request.getAddress(),
                Role.ROLE_CUSTOMER
        );

        User savedUser = userRepository.save(user);

        // Initialize empty Cart for new User
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        String token = "mock-jwt-token-" + UUID.randomUUID().toString();

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "User registered successfully"
        );
    }

    @Override
    public AuthResponse loginUser(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = "mock-jwt-token-" + UUID.randomUUID().toString();

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
