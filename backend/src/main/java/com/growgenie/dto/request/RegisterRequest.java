package com.growgenie.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// ─── Auth Requests ────────────────────────────────────────────────────────────

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Valid email required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
