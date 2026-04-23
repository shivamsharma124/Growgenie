package com.growgenie.repository;

import com.growgenie.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    List<Invoice> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Invoice> findByIdAndUserId(String id, String userId);
    long countByUserId(String userId);
}
