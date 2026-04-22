package com.growgenie.service.impl;

import com.growgenie.dto.request.LoginRequest;
import com.growgenie.dto.request.RegisterRequest;
import com.growgenie.dto.request.SubscriptionRequest;
import com.growgenie.dto.response.AuthResponse;
import com.growgenie.entity.User;
import com.growgenie.exception.DuplicateResourceException;
import com.growgenie.exception.ResourceNotFoundException;
import com.growgenie.exception.UnauthorizedException;
import com.growgenie.repository.UserRepository;
import com.growgenie.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .subscriptionPlan(User.SubscriptionPlan.FREE_TRIAL)
                .subscriptionExpiry(LocalDateTime.now().plusDays(7)) // 7-day free trial
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token, "Registration successful! 7-day free trial activated.");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token, "Login successful");
    }

    public AuthResponse updateSubscription(String email, SubscriptionRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDateTime expiry = request.getPlan() == User.SubscriptionPlan.YEARLY
                ? LocalDateTime.now().plusYears(1)
                : LocalDateTime.now().plusMonths(1);

        user.setSubscriptionPlan(request.getPlan());
        user.setSubscriptionExpiry(expiry);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token, "Subscription updated to " + request.getPlan());
    }

    public AuthResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildAuthResponse(user, null, "Profile fetched");
    }

    private AuthResponse buildAuthResponse(User user, String token, String message) {
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .subscriptionPlan(user.getSubscriptionPlan() != null ? user.getSubscriptionPlan().name() : null)
                .subscriptionExpiry(user.getSubscriptionExpiry() != null
                        ? user.getSubscriptionExpiry().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                        : null)
                .message(message)
                .build();
    }
}
