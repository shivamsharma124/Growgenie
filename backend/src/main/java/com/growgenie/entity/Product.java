package com.growgenie.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    private String userId;

    @NotBlank(message = "Product name cannot be blank")
    private String name;

    private String description;

    private String category;

    @Positive(message = "Price must be greater than 0")
    private Double price;

    @Builder.Default
    private Integer stock = 0;

    @CreatedDate
    private LocalDateTime createdAt;
}