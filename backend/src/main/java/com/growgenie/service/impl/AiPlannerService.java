package com.growgenie.service.impl;

import com.growgenie.dto.request.AiRequest;
import com.growgenie.dto.response.AiResponse;
import com.growgenie.entity.AiGeneration;
import com.growgenie.entity.User;
import com.growgenie.exception.ResourceNotFoundException;
import com.growgenie.exception.SubscriptionRequiredException;
import com.growgenie.repository.AiGenerationRepository;
import com.growgenie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiPlannerService {

    private final OpenAiService openAiService;
    private final AiGenerationRepository aiGenerationRepository;
    private final UserRepository userRepository;

    public AiResponse generateRoadmap(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        String system = "You are an expert Indian startup business advisor. Create detailed, actionable roadmaps for Indian micro-entrepreneurs.";
        String prompt = "Create a 6-month startup roadmap for this business: " + request.getInput()
                + (request.getExtra() != null ? "\nTarget Market: " + request.getExtra() : "")
                + "\n\nInclude monthly goals, key milestones, marketing steps, and financial targets. Format clearly with Month 1, Month 2, etc.";
        return saveAndReturn(user, AiGeneration.GenerationType.ROADMAP, prompt, openAiService.call(system, prompt));
    }

    public AiResponse generateMarketStrategy(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        String system = "You are an expert Indian market strategist specializing in SME growth strategies.";
        String prompt = "Create a detailed market strategy for: " + request.getInput()
                + (request.getExtra() != null ? "\nRegion: " + request.getExtra() : "")
                + "\n\nCover: Target audience, USP, pricing strategy, distribution channels, and competitive analysis.";
        return saveAndReturn(user, AiGeneration.GenerationType.MARKET_STRATEGY, prompt, openAiService.call(system, prompt));
    }

    public AiResponse generateAdCopy(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        String system = "You are a creative Indian marketing copywriter. Write compelling ad copy for Indian social media.";
        String prompt = "Write social media ad copy for: " + request.getInput()
                + (request.getExtra() != null ? "\nTarget audience: " + request.getExtra() : "")
                + "\n\nInclude: Instagram caption, Facebook ad copy, and a Google Ads headline. Make it engaging and India-specific.";
        return saveAndReturn(user, AiGeneration.GenerationType.AD_COPY, prompt, openAiService.call(system, prompt));
    }

    public AiResponse generateProductDescription(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        String system = "You are an SEO-focused product copywriter for Indian e-commerce platforms.";
        String prompt = "Write an SEO-optimized product description for: " + request.getInput()
                + (request.getExtra() != null ? "\nCategory: " + request.getExtra() : "")
                + "\n\nInclude: Catchy title, features list, and a persuasive call-to-action. Keep it under 150 words.";
        return saveAndReturn(user, AiGeneration.GenerationType.PRODUCT_DESCRIPTION, prompt, openAiService.call(system, prompt));
    }

    public AiResponse translateContent(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        String targetLang = request.getExtra() != null ? request.getExtra() : "Hindi";
        String system = "You are a professional translator specializing in Indian regional languages for marketing content.";
        String prompt = "Translate the following marketing content to " + targetLang
                + " while keeping the tone engaging and culturally appropriate:\n\n" + request.getInput();
        return saveAndReturn(user, AiGeneration.GenerationType.TRANSLATION, prompt, openAiService.call(system, prompt));
    }

    public AiResponse generatePosterPrompt(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        String system = "You are an expert at writing DALL-E image generation prompts for Indian business branding.";
        String prompt = "Write a detailed DALL-E image generation prompt for a business poster for: " + request.getInput()
                + "\n\nInclude: visual style, colors, composition, cultural elements, and text placement suggestions.";
        return saveAndReturn(user, AiGeneration.GenerationType.POSTER_PROMPT, prompt, openAiService.call(system, prompt));
    }

    public AiResponse askFaqBot(String email, AiRequest request) {
        User user = getSubscribedUser(email);
        // Get user's FAQ knowledge base
        String system = "You are a helpful customer support assistant. Answer questions based only on the provided business FAQ knowledge base. Be concise and friendly.";
        String prompt = "Customer question: " + request.getInput()
                + (request.getExtra() != null ? "\n\nBusiness FAQ Knowledge Base:\n" + request.getExtra() : "");
        return saveAndReturn(user, AiGeneration.GenerationType.FAQ_ANSWER, prompt, openAiService.call(system, prompt));
    }

    public List<AiResponse> getHistory(String email) {
        User user = getUser(email);
        return aiGenerationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private AiResponse saveAndReturn(User user, AiGeneration.GenerationType type, String prompt, String result) {
        AiGeneration gen = AiGeneration.builder()
                .user(user).type(type).prompt(prompt).result(result).build();
        return toResponse(aiGenerationRepository.save(gen));
    }

    private User getSubscribedUser(String email) {
        User user = getUser(email);
        if (user.getSubscriptionExpiry() == null || user.getSubscriptionExpiry().isBefore(LocalDateTime.now())) {
            throw new SubscriptionRequiredException("Active subscription required to use AI features. Please subscribe to continue.");
        }
        return user;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AiResponse toResponse(AiGeneration g) {
        return AiResponse.builder()
                .id(g.getId()).type(g.getType())
                .prompt(g.getPrompt()).result(g.getResult())
                .createdAt(g.getCreatedAt()).build();
    }
}
