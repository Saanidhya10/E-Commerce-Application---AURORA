package com.example.ecommerceapp.config;

import com.example.ecommerceapp.entity.Address;
import com.example.ecommerceapp.entity.Category;
import com.example.ecommerceapp.entity.Product;
import com.example.ecommerceapp.entity.User;
import com.example.ecommerceapp.enums.RoleType;
import com.example.ecommerceapp.repository.AddressRepository;
import com.example.ecommerceapp.repository.CategoryRepository;
import com.example.ecommerceapp.repository.ProductRepository;
import com.example.ecommerceapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsersAndAddresses();
        seedCategoriesAndProducts();
        migratePricesAndAddressesToIndia();
    }

    private void seedUsersAndAddresses() {
        if (userRepository.count() == 0) {
            log.info("Seeding default users...");

            // 1. Admin User
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(RoleType.ADMIN);
            userRepository.save(admin);

            // 2. Customer User (Indian Oriented)
            User customer = new User();
            customer.setName("Aarav Sharma");
            customer.setEmail("customer@ecommerce.com");
            customer.setPassword(passwordEncoder.encode("Customer@123"));
            customer.setRole(RoleType.CUSTOMER);
            User savedCustomer = userRepository.save(customer);

            // 3. Sample Address for Customer (Bengaluru, India)
            Address address = new Address();
            address.setUser(savedCustomer);
            address.setFullName("Aarav Sharma");
            address.setPhoneNumber("+91 98765 43210");
            address.setAddressLine1("Flat 402, Palm Heights, Outer Ring Road");
            address.setAddressLine2("Near EcoSpace, Bellandur");
            address.setCity("Bengaluru");
            address.setState("Karnataka");
            address.setPostalCode("560103");
            address.setCountry("India");
            addressRepository.save(address);

            log.info("Default users seeded: admin@ecommerce.com / customer@ecommerce.com");
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding default categories and products in Indian Rupees...");

            Map<String, Category> categories = new HashMap<>();

            Category electronics = createCategory("Electronics", "Smartphones, Laptops, Audio & Tech Accessories");
            Category fashion = createCategory("Fashion", "Trending Apparel, Footwear, & Accessories");
            Category home = createCategory("Home & Living", "Modern Furniture, Home Decor & Kitchen Essentials");
            Category sports = createCategory("Sports & Fitness", "Fitness Equipment, Activewear & Outdoor Gear");
            Category books = createCategory("Books", "Bestsellers, Fiction, Self-Help & Academic Literature");

            categories.put("Electronics", categoryRepository.save(electronics));
            categories.put("Fashion", categoryRepository.save(fashion));
            categories.put("Home & Living", categoryRepository.save(home));
            categories.put("Sports & Fitness", categoryRepository.save(sports));
            categories.put("Books", categoryRepository.save(books));

            if (productRepository.count() == 0) {
                // Electronics (Prices in INR multiplied by ~90)
                createProduct("Ultra Wireless Noise-Cancelling Headphones",
                        "Experience high-fidelity audio with active noise cancellation, 40-hour battery life, and ultra-plush memory foam earcups.",
                        new BigDecimal("26999.00"), 45,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                        "SoundPro", categories.get("Electronics"));

                createProduct("Smartwatch Series X Pro",
                        "Next-generation AMOLED display with heart-rate tracking, GPS navigation, water resistance to 50m, and 7-day battery life.",
                        new BigDecimal("22499.00"), 30,
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                        "TechFit", categories.get("Electronics"));

                createProduct("Pro Mechanical Gaming Keyboard",
                        "RGB backlit mechanical switches, aircraft-grade aluminum frame, dedicated media controls, and programmable macro keys.",
                        new BigDecimal("11655.00"), 60,
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                        "KeyCraft", categories.get("Electronics"));

                // Fashion
                createProduct("Classic Minimalist Leather Watch",
                        "Crafted with surgical-grade stainless steel and genuine top-grain Italian leather strap with Japanese quartz movement.",
                        new BigDecimal("14310.00"), 25,
                        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
                        "Aura Timeworks", categories.get("Fashion"));

                createProduct("Heritage Waterproof Canvas Backpack",
                        "Durable water-resistant waxed canvas with genuine leather accents, padded 15-inch laptop sleeve, and ergonomic shoulder straps.",
                        new BigDecimal("8095.00"), 40,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                        "Nomad Gear", categories.get("Fashion"));

                createProduct("Polarized Aviator Sunglasses",
                        "Lightweight titanium frame with 100% UV400 polarized crystal lenses for maximum clarity and eye protection.",
                        new BigDecimal("6750.00"), 50,
                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
                        "Lumina", categories.get("Fashion"));

                // Home & Living
                createProduct("Ceramic Pour-Over Coffee Dripper Set",
                        "Artisan matte ceramic carafe with precision stainless steel mesh filter for the ultimate aromatic pour-over coffee experience.",
                        new BigDecimal("4320.00"), 35,
                        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
                        "BrewMaster", categories.get("Home & Living"));

                createProduct("Aroma Ultrasonic Essential Oil Diffuser",
                        "Ultrasonic cool mist diffuser with warm ambient LED glow, whisper-quiet operation, and auto shut-off protection.",
                        new BigDecimal("3599.00"), 80,
                        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
                        "ZenLiving", categories.get("Home & Living"));

                // Sports & Fitness
                createProduct("Professional Non-Slip Yoga Mat",
                        "Eco-friendly natural rubber mat with alignment guide lines, exceptional grip even when sweaty, and extra joint cushioning.",
                        new BigDecimal("5850.00"), 70,
                        "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
                        "FlowState", categories.get("Sports & Fitness"));

                createProduct("Insulated Stainless Steel Water Bottle 1L",
                        "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. Sweat-free powder-coated exterior.",
                        new BigDecimal("2699.00"), 120,
                        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
                        "HydroPeak", categories.get("Sports & Fitness"));

                // Books
                createProduct("Designing Data-Intensive Applications",
                        "The comprehensive guide to the principles and algorithms underpinning modern data systems and distributed architectures.",
                        new BigDecimal("3869.00"), 90,
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
                        "O'Reilly Media", categories.get("Books"));

                createProduct("Atomic Habits: Proven Framework",
                        "An easy and proven way to build good habits and break bad ones. Insights on small changes leading to remarkable results.",
                        new BigDecimal("2245.00"), 150,
                        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
                        "Penguin Random House", categories.get("Books"));
            }

            log.info("Default categories and sample products seeded successfully in INR.");
        }
    }

    private void migratePricesAndAddressesToIndia() {
        // Multiplies any dollar prices by 90 if below threshold
        for (Product p : productRepository.findAll()) {
            if (p.getPrice() != null && p.getPrice().compareTo(new BigDecimal("1000")) < 0) {
                p.setPrice(p.getPrice().multiply(new BigDecimal("90")).setScale(2, RoundingMode.HALF_UP));
                productRepository.save(p);
            }
        }

        // Updates US sample address to India
        for (Address a : addressRepository.findAll()) {
            if ("United States".equalsIgnoreCase(a.getCountry()) || "USA".equalsIgnoreCase(a.getCountry())) {
                a.setFullName("Aarav Sharma");
                a.setPhoneNumber("+91 98765 43210");
                a.setAddressLine1("Flat 402, Palm Heights, Outer Ring Road");
                a.setAddressLine2("Near EcoSpace, Bellandur");
                a.setCity("Bengaluru");
                a.setState("Karnataka");
                a.setPostalCode("560103");
                a.setCountry("India");
                addressRepository.save(a);
            }
        }
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return category;
    }

    private void createProduct(String name, String description, BigDecimal price, int stock, String imageUrl, String brand, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setImageUrl(imageUrl);
        product.setBrand(brand);
        product.setCategory(category);
        product.setActive(true);
        productRepository.save(product);
    }

}
