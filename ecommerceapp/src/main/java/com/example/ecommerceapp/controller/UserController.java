package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.UpdateProfileRequest;
import com.example.ecommerceapp.dto.response.UserResponse;
import com.example.ecommerceapp.service.UserService;
import com.example.ecommerceapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User fetched successfully", user)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        UserResponse user = userService.updateUser(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User updated successfully", user)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User deleted successfully", null)
        );
    }

}