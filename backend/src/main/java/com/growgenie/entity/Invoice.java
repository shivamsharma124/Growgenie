package com.growgenie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String customerName;
    private String customerEmail;

    // JSON string of items: [{"name":"Chai","qty":2,"price":299}]
    @Column(columnDefinition = "TEXT")
    private String itemsJson;

    private Double subtotal;
    private Double gst;
    private Double total;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    private String pdfPath;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = InvoiceStatus.UNPAID;
    }

    public enum InvoiceStatus {
        PAID, UNPAID, PENDING
    }
}
