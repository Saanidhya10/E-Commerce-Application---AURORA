package com.ecom.electronics.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal oldPrice;

    private Double rating = 5.0;

    private Integer reviewCount = 0;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    private Boolean inStock = true;

    private Boolean featured = false;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDateTime createdAt;

    public Product() {}

    public Product(String name, String brand, String description, BigDecimal price, BigDecimal oldPrice,
                   Integer stockQuantity, Boolean featured, String imageUrl, Category category) {
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.price = price;
        this.oldPrice = oldPrice;
        this.stockQuantity = stockQuantity;
        this.inStock = stockQuantity > 0;
        this.featured = featured;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.stockQuantity != null) {
            this.inStock = this.stockQuantity > 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (this.stockQuantity != null) {
            this.inStock = this.stockQuantity > 0;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
        this.inStock = stockQuantity != null && stockQuantity > 0;
    }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
