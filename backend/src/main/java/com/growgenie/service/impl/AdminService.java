package com.growgenie.service.impl;

import com.growgenie.dto.response.AuthResponse;
import com.growgenie.entity.User;
import com.growgenie.exception.ResourceNotFoundException;
import com.growgenie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<AuthResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }

    public AuthResponse promoteToAdmin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setRole(User.Role.ADMIN);
        return toResponse(userRepository.save(user));
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    private AuthResponse toResponse(User user) {
        return AuthResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .subscriptionPlan(user.getSubscriptionPlan() != null ? user.getSubscriptionPlan().name() : "NONE")
                .subscriptionExpiry(user.getSubscriptionExpiry() != null
                        ? user.getSubscriptionExpiry().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                        : "N/A")
                .build();
    }
}
