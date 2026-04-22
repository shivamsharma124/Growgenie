package com.growgenie.repository;

import com.growgenie.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Invoice> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}
