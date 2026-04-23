package com.growgenie.repository;

import com.growgenie.entity.Faq;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FaqRepository extends MongoRepository<Faq, String> {
    List<Faq> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Faq> findByIdAndUserId(String id, String userId);
    long countByUserId(String userId);
}
