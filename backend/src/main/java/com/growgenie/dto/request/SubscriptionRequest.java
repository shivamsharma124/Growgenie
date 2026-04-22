package com.growgenie.dto.request;

import com.growgenie.entity.User;
import lombok.Data;

@Data
public class SubscriptionRequest {
    private User.SubscriptionPlan plan; // MONTHLY or YEARLY
}
