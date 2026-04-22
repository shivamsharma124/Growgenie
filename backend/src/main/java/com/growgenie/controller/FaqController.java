package com.growgenie.controller;

import com.growgenie.dto.request.FaqRequest;
import com.growgenie.dto.response.ApiResponse;
import com.growgenie.dto.response.FaqResponse;
import com.growgenie.service.impl.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
@Tag(name = "FAQ Bot", description = "Train and manage customer FAQ knowledge base")
public class FaqController {

    private final FaqService faqService;

    @PostMapping("/train")
    @Operation(summary = "Add a Q&A pair to knowledge base")
    public ResponseEntity<ApiResponse<FaqResponse>> train(
            Authentication auth, @Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("FAQ added", faqService.train(auth.getName(), request)));
    }

    @GetMapping
    @Operation(summary = "Get all FAQ entries")
    public ResponseEntity<ApiResponse<List<FaqResponse>>> getAll(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(faqService.getAll(auth.getName())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an FAQ entry")
    public ResponseEntity<ApiResponse<Void>> delete(Authentication auth, @PathVariable Long id) {
        faqService.delete(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.ok("FAQ deleted", null));
    }
}
