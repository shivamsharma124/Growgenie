package com.growgenie.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class InvoiceRequest {
    @NotBlank(message = "Customer name is required")
    private String customerName;
    private String customerEmail;
    @NotEmpty(message = "At least one item is required")
    private List<InvoiceItem> items;

    @Data
    public static class InvoiceItem {
        private String name;
        private Integer quantity;
        private Double price;
    }
}
