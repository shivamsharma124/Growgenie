package com.growgenie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_generations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGeneration {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private GenerationType type;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(columnDefinition = "LONGTEXT")
    private String result;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum GenerationType {
        ROADMAP, MARKET_STRATEGY, AD_COPY, PRODUCT_DESCRIPTION, TRANSLATION, POSTER_PROMPT, FAQ_ANSWER
    }
}
