package com.growgenie.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String password;

    @Builder.Default
    private Role role = Role.USER;

    private SubscriptionPlan subscriptionPlan;

    private LocalDateTime subscriptionExpiry;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum Role {
        USER, ADMIN
    }

    public enum SubscriptionPlan {
        FREE_TRIAL, MONTHLY, YEARLY
    }
}