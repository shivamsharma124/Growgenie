package com.growgenie.repository;

import com.growgenie.entity.AiGeneration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiGenerationRepository extends JpaRepository<AiGeneration, Long> {
    List<AiGeneration> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);
}
