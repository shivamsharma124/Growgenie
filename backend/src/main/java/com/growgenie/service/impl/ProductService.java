package com.growgenie.service.impl;

import com.growgenie.dto.request.ProductRequest;
import com.growgenie.dto.response.ProductResponse;
import com.growgenie.entity.Product;
import com.growgenie.entity.User;
import com.growgenie.exception.ResourceNotFoundException;
import com.growgenie.repository.ProductRepository;
import com.growgenie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductResponse create(String email, ProductRequest request) {
        User user = getUser(email);
        Product product = Product.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();
        return toResponse(productRepository.save(product));
    }

    public List<ProductResponse> getAllByUser(String email) {
        User user = getUser(email);
        return productRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse getById(String email, Long id) {
        User user = getUser(email);
        Product product = productRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toResponse(product);
    }

    public ProductResponse update(String email, Long id, ProductRequest request) {
        User user = getUser(email);
        Product product = productRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = getUser(email);
        productRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.deleteByIdAndUserId(id, user.getId());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .category(p.getCategory())
                .price(p.getPrice())
                .stock(p.getStock())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
