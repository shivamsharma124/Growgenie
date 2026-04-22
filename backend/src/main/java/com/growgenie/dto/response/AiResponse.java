package com.growgenie.dto.response;

import com.growgenie.entity.AiGeneration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiResponse {
    private Long id;
    private AiGeneration.GenerationType type;
    private String prompt;
    private String result;
    private LocalDateTime createdAt;
}
