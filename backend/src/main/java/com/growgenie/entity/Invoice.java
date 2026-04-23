package com.growgenie.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    private String id;

    private String userId;

    private String customerName;
    private String customerEmail;

    // JSON string of items
    private String itemsJson;

    private Double subtotal;
    private Double gst;
    private Double total;

    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.UNPAID;

    private String pdfPath;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum InvoiceStatus {
        PAID, UNPAID, PENDING
    }
}