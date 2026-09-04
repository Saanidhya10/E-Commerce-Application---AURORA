package com.example.ecommerceapp.controller;

import com.example.ecommerceapp.dto.request.AddressRequest;
import com.example.ecommerceapp.dto.response.AddressResponse;
import com.example.ecommerceapp.service.AddressService;
import com.example.ecommerceapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getUserAddresses(Principal principal) {
        List<AddressResponse> addresses = addressService.getUserAddresses(principal.getName());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Addresses retrieved successfully", addresses)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            Principal principal,
            @RequestBody AddressRequest request
    ) {
        AddressResponse address = addressService.addAddress(principal.getName(), request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Address added successfully", address)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            Principal principal,
            @PathVariable Long id
    ) {
        addressService.deleteAddress(principal.getName(), id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Address deleted successfully", null)
        );
    }

}
