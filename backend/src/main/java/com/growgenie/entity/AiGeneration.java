package com.growgenie.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_generations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGeneration {

    @Id
    private String id;

    private String userId;

    private GenerationType type;

    private String prompt;

    private String result;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum GenerationType {
        ROADMAP,
        MARKET_STRATEGY,
        AD_COPY,
        PRODUCT_DESCRIPTION,
        TRANSLATION,
        POSTER_PROMPT,
        FAQ_ANSWER
    }
}