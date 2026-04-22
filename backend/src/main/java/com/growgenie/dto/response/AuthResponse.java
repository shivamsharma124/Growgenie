package com.growgenie.dto.response;

import com.growgenie.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private String role;
    private String subscriptionPlan;
    private String subscriptionExpiry;
    private String message;
}
