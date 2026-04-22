package com.growgenie.repository;

import com.growgenie.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Faq> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}
