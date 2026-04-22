package com.growgenie.controller;

import com.growgenie.dto.request.LoginRequest;
import com.growgenie.dto.request.RegisterRequest;
import com.growgenie.dto.request.SubscriptionRequest;
import com.growgenie.dto.response.ApiResponse;
import com.growgenie.dto.response.AuthResponse;
import com.growgenie.service.impl.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, profile, subscription")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user (7-day free trial activated)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> getProfile(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(authService.getProfile(auth.getName())));
    }

    @PostMapping("/subscription")
    @Operation(summary = "Choose or upgrade subscription plan")
    public ResponseEntity<ApiResponse<AuthResponse>> updateSubscription(
            Authentication auth,
            @RequestBody SubscriptionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Subscription updated",
                authService.updateSubscription(auth.getName(), request)));
    }
}
