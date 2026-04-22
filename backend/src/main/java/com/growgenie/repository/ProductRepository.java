package com.growgenie.repository;

import com.growgenie.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUserId(Long userId);
    Optional<Product> findByIdAndUserId(Long id, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}
