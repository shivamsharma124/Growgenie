package com.growgenie.controller;

import com.growgenie.dto.request.ProductRequest;
import com.growgenie.dto.response.ApiResponse;
import com.growgenie.dto.response.ProductResponse;
import com.growgenie.service.impl.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "CRUD for entrepreneur product catalog")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @Operation(summary = "Add a new product")
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            Authentication auth, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Product created", productService.create(auth.getName(), request)));
    }

    @GetMapping
    @Operation(summary = "Get all products for current user")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllByUser(auth.getName())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(auth.getName(), id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            Authentication auth, @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.update(auth.getName(), id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<ApiResponse<Void>> delete(Authentication auth, @PathVariable Long id) {
        productService.delete(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
    }
}
