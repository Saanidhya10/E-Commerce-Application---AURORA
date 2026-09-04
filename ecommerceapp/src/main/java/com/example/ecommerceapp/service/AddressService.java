package com.example.ecommerceapp.service;

import com.example.ecommerceapp.dto.request.AddressRequest;
import com.example.ecommerceapp.dto.response.AddressResponse;

import java.util.List;

public interface AddressService {

    List<AddressResponse> getUserAddresses(String userEmail);

    AddressResponse addAddress(String userEmail, AddressRequest request);

    void deleteAddress(String userEmail, Long addressId);

}
