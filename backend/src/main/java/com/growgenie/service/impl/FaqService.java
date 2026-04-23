package com.growgenie.service.impl;

import com.growgenie.dto.request.FaqRequest;
import com.growgenie.dto.response.FaqResponse;
import com.growgenie.entity.Faq;
import com.growgenie.entity.User;
import com.growgenie.exception.ResourceNotFoundException;
import com.growgenie.repository.FaqRepository;
import com.growgenie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;
    private final UserRepository userRepository;

    public FaqResponse train(String email, FaqRequest request) {
        User user = getUser(email);
        Faq faq = Faq.builder()
                .userId(user.getId())
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .build();
        return toResponse(faqRepository.save(faq));
    }

    public List<FaqResponse> getAll(String email) {
        User user = getUser(email);
        return faqRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void delete(String email, String id) {
        User user = getUser(email);
        Faq faq = faqRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found: " + id));
        faqRepository.delete(faq);
    }

    // Build FAQ context string for OpenAI
    public String buildFaqContext(String email) {
        User user = getUser(email);
        List<Faq> faqs = faqRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (faqs.isEmpty()) return "No FAQ knowledge base found.";
        StringBuilder sb = new StringBuilder();
        faqs.forEach(f -> sb.append("Q: ").append(f.getQuestion())
                .append("\nA: ").append(f.getAnswer()).append("\n\n"));
        return sb.toString();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private FaqResponse toResponse(Faq f) {
        return FaqResponse.builder()
                .id(f.getId()).question(f.getQuestion())
                .answer(f.getAnswer()).createdAt(f.getCreatedAt()).build();
    }
}
