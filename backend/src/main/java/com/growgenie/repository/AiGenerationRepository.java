package com.growgenie.repository;

import com.growgenie.entity.AiGeneration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiGenerationRepository extends MongoRepository<AiGeneration, String> {
    List<AiGeneration> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserId(String userId);
}
