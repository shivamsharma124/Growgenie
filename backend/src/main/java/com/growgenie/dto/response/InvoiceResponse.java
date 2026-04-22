package com.growgenie.dto.response;

import com.growgenie.entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String itemsJson;
    private Double subtotal;
    private Double gst;
    private Double total;
    private Invoice.InvoiceStatus status;
    private String pdfPath;
    private LocalDateTime createdAt;
}
