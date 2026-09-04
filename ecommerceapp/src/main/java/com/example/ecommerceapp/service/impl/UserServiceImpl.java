package com.example.ecommerceapp.service.impl;

import com.example.ecommerceapp.dto.request.UpdateProfileRequest;
import com.example.ecommerceapp.dto.response.UserResponse;
import com.example.ecommerceapp.entity.User;
import com.example.ecommerceapp.exception.ResourceNotFoundException;
import com.example.ecommerceapp.mapper.UserMapper;
import com.example.ecommerceapp.repository.UserRepository;
import com.example.ecommerceapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateProfileRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        existingUser.setName(request.getName());
        User updatedUser = userRepository.save(existingUser);

        return userMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);
    }

}