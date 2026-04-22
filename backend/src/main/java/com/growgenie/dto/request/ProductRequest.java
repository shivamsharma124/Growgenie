package com.growgenie.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;
    private String description;
    private String category;
    @Positive(message = "Price must be greater than 0")
    private Double price;
    private Integer stock;
}
