package com.growgenie.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "faqs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Faq {

    @Id
    private String id;

    private String userId;

    private String question;

    private String answer;

    @CreatedDate
    private LocalDateTime createdAt;
}