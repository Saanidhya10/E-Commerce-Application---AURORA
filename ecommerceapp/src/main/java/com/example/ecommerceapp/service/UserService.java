package com.example.ecommerceapp.service;

import com.example.ecommerceapp.dto.request.UpdateProfileRequest;
import com.example.ecommerceapp.dto.response.UserResponse;

public interface UserService {

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UpdateProfileRequest request);

    void deleteUser(Long id);

}