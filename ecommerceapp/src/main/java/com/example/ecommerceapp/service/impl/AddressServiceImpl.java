package com.example.ecommerceapp.service.impl;

import com.example.ecommerceapp.dto.request.AddressRequest;
import com.example.ecommerceapp.dto.response.AddressResponse;
import com.example.ecommerceapp.entity.Address;
import com.example.ecommerceapp.entity.User;
import com.example.ecommerceapp.exception.ResourceNotFoundException;
import com.example.ecommerceapp.repository.AddressRepository;
import com.example.ecommerceapp.repository.UserRepository;
import com.example.ecommerceapp.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(String userEmail) {
        User user = getUserByEmail(userEmail);
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse addAddress(String userEmail, AddressRequest request) {
        User user = getUserByEmail(userEmail);

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());

        Address saved = addressRepository.save(address);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteAddress(String userEmail, Long addressId) {
        User user = getUserByEmail(userEmail);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        addressRepository.delete(address);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private AddressResponse mapToResponse(Address a) {
        return new AddressResponse(
                a.getId(),
                a.getFullName(),
                a.getPhoneNumber(),
                a.getAddressLine1(),
                a.getAddressLine2(),
                a.getCity(),
                a.getState(),
                a.getPostalCode(),
                a.getCountry()
        );
    }

}
