package com.growgenie.controller;

import com.growgenie.dto.request.AiRequest;
import com.growgenie.dto.response.AiResponse;
import com.growgenie.dto.response.ApiResponse;
import com.growgenie.service.impl.AiPlannerService;
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
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Features", description = "OpenAI-powered business tools")
public class AiController {

    private final AiPlannerService aiPlannerService;
    private final FaqService faqService;

    @PostMapping("/roadmap")
    @Operation(summary = "Generate 6-month startup roadmap")
    public ResponseEntity<ApiResponse<AiResponse>> roadmap(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.generateRoadmap(auth.getName(), request)));
    }

    @PostMapping("/market-strategy")
    @Operation(summary = "Generate market strategy")
    public ResponseEntity<ApiResponse<AiResponse>> marketStrategy(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.generateMarketStrategy(auth.getName(), request)));
    }

    @PostMapping("/ad-copy")
    @Operation(summary = "Generate ad copy for social media")
    public ResponseEntity<ApiResponse<AiResponse>> adCopy(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.generateAdCopy(auth.getName(), request)));
    }

    @PostMapping("/product-description")
    @Operation(summary = "Generate SEO product description")
    public ResponseEntity<ApiResponse<AiResponse>> productDesc(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.generateProductDescription(auth.getName(), request)));
    }

    @PostMapping("/translate")
    @Operation(summary = "Translate marketing content to regional language (extra = Hindi/Tamil/Bengali/Marathi)")
    public ResponseEntity<ApiResponse<AiResponse>> translate(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.translateContent(auth.getName(), request)));
    }

    @PostMapping("/poster-prompt")
    @Operation(summary = "Generate DALL-E poster prompt")
    public ResponseEntity<ApiResponse<AiResponse>> posterPrompt(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.generatePosterPrompt(auth.getName(), request)));
    }

    @PostMapping("/faq-ask")
    @Operation(summary = "Ask FAQ bot — AI answers from knowledge base")
    public ResponseEntity<ApiResponse<AiResponse>> faqAsk(
            Authentication auth, @Valid @RequestBody AiRequest request) {
        // Inject FAQ context from user's knowledge base
        String context = faqService.buildFaqContext(auth.getName());
        request.setExtra(context);
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.askFaqBot(auth.getName(), request)));
    }

    @GetMapping("/history")
    @Operation(summary = "Get all AI generation history")
    public ResponseEntity<ApiResponse<List<AiResponse>>> history(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(aiPlannerService.getHistory(auth.getName())));
    }
}
