package com.growgenie.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiRequest {
    @NotBlank(message = "Prompt/input is required")
    private String input;
    private String extra; // targetMarket, targetAudience, language, etc.
}
