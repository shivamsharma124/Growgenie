package com.growgenie.controller;

import com.growgenie.dto.response.ApiResponse;
import com.growgenie.dto.response.AuthResponse;
import com.growgenie.service.impl.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only user management endpoints")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @Operation(summary = "Get all registered users")
    public ResponseEntity<ApiResponse<List<AuthResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers()));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user by ID")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }

    @PutMapping("/users/{id}/promote")
    @Operation(summary = "Promote user to ADMIN role")
    public ResponseEntity<ApiResponse<AuthResponse>> promoteToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("User promoted to admin",
                adminService.promoteToAdmin(id)));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("totalUsers", adminService.getTotalUsers())));
    }
}
