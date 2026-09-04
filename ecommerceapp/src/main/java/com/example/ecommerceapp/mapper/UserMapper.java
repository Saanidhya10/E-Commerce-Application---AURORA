package com.example.ecommerceapp.mapper;

import com.example.ecommerceapp.dto.request.RegisterRequest;
import com.example.ecommerceapp.dto.response.UserResponse;
import com.example.ecommerceapp.entity.User;
import com.example.ecommerceapp.enums.RoleType;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request, String encodedPassword) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(RoleType.CUSTOMER);

        return user;
    }

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

}