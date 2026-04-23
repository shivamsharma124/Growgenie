package com.growgenie.controller;

import com.growgenie.dto.request.InvoiceRequest;
import com.growgenie.dto.response.ApiResponse;
import com.growgenie.dto.response.InvoiceResponse;
import com.growgenie.entity.Invoice;
import com.growgenie.service.impl.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "PDF invoice generation and management")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/generate")
    @Operation(summary = "Generate a new GST invoice and PDF")
    public ResponseEntity<ApiResponse<InvoiceResponse>> generate(
            Authentication auth, @Valid @RequestBody InvoiceRequest request) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Invoice generated", invoiceService.create(auth.getName(), request)));
    }

    @GetMapping
    @Operation(summary = "Get all invoices for current user")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAll(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(invoiceService.getAllByUser(auth.getName())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice by ID")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getById(Authentication auth, @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(invoiceService.getById(auth.getName(), id)));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update invoice status: PAID, UNPAID, PENDING")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateStatus(
            Authentication auth,
            @PathVariable String id,
            @RequestParam Invoice.InvoiceStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                invoiceService.updateStatus(auth.getName(), id, status)));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download invoice PDF")
    public ResponseEntity<Resource> download(Authentication auth, @PathVariable String id) {
        String path = invoiceService.getPdfPath(auth.getName(), id);
        Resource resource = new FileSystemResource(path);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"INV-" + id + ".pdf\"")
                .body(resource);
    }
}
