// Initial Electronics Catalog Data Structure (Matches Spring Boot DB Schema)

window.ECOM_INITIAL_DATA = {
  categories: [
    { id: 1, name: "Laptops & Computers", slug: "laptops-computers", description: "High performance laptops and accessories", imageUrl: "img/laptop.png" },
    { id: 2, name: "Smartphones & Tablets", slug: "smartphones-tablets", description: "Flagship mobile devices", imageUrl: "img/smartphone.png" },
    { id: 3, name: "Audio & Headphones", slug: "audio-headphones", description: "Premium noise-canceling sound gear", imageUrl: "img/headphones.png" },
    { id: 4, name: "Wearables & Smartwatches", slug: "wearables-smartwatches", description: "Fitness and health smart trackers", imageUrl: "img/smartwatch.png" }
  ],

  products: [
    {
      id: 1,
      name: "UltraBook Pro 15 Laptop",
      brand: "TechPro",
      description: "15.6\" QHD Display, Intel Core i7 13th Gen, 16GB RAM, 512GB NVMe SSD, Backlit Keyboard, All-day Battery Life.",
      price: 1299.99,
      oldPrice: 1499.99,
      rating: 4.8,
      reviewCount: 124,
      stockQuantity: 25,
      inStock: true,
      featured: true,
      imageUrl: "img/laptop.png",
      categoryId: 1,
      categoryName: "Laptops & Computers"
    },
    {
      id: 2,
      name: "Galaxy Ultra Flagship Smartphone",
      brand: "NovaTech",
      description: "6.8\" Dynamic AMOLED 120Hz, 200MP Triple Camera, 12GB RAM, 256GB Storage, 5000mAh Battery, 5G Capable.",
      price: 999.00,
      oldPrice: 1199.00,
      rating: 4.7,
      reviewCount: 98,
      stockQuantity: 18,
      inStock: true,
      featured: true,
      imageUrl: "img/smartphone.png",
      categoryId: 2,
      categoryName: "Smartphones & Tablets"
    },
    {
      id: 3,
      name: "Noise-Canceling Wireless Headphones",
      brand: "AcousticLab",
      description: "Active Noise Cancellation, 40-hour Battery Life, Spatial Audio, Ultra-soft Memory Foam Earcups, Bluetooth 5.3.",
      price: 249.50,
      oldPrice: 299.99,
      rating: 4.9,
      reviewCount: 210,
      stockQuantity: 40,
      inStock: true,
      featured: true,
      imageUrl: "img/headphones.png",
      categoryId: 3,
      categoryName: "Audio & Headphones"
    },
    {
      id: 4,
      name: "Smart Health & Fitness Watch v5",
      brand: "PulseGear",
      description: "Vivid AMOLED Display, Continuous Heart Rate Monitoring, SpO2 & Sleep Tracking, GPS Built-in, 50m Water Resistant.",
      price: 179.99,
      oldPrice: 219.99,
      rating: 4.6,
      reviewCount: 85,
      stockQuantity: 30,
      inStock: true,
      featured: true,
      imageUrl: "img/smartwatch.png",
      categoryId: 4,
      categoryName: "Wearables & Smartwatches"
    },
    {
      id: 5,
      name: "Ergonomic Precision Wireless Mouse",
      brand: "TechPro",
      description: "Dual Connectivity (Bluetooth & 2.4GHz), 4000 DPI Optical Sensor, Quiet Click Switches, Rechargeable Type-C.",
      price: 49.99,
      oldPrice: 59.99,
      rating: 4.5,
      reviewCount: 62,
      stockQuantity: 50,
      inStock: true,
      featured: false,
      imageUrl: "img/laptop.png",
      categoryId: 1,
      categoryName: "Laptops & Computers"
    },
    {
      id: 6,
      name: "High-Speed Portable NVMe SSD 1TB",
      brand: "ByteSpeed",
      description: "Read speeds up to 1050MB/s, USB 3.2 Gen 2 Type-C, Shock-resistant aluminum casing, Compact pocket size.",
      price: 109.99,
      oldPrice: 139.99,
      rating: 4.8,
      reviewCount: 145,
      stockQuantity: 35,
      inStock: true,
      featured: false,
      imageUrl: "img/laptop.png",
      categoryId: 1,
      categoryName: "Laptops & Computers"
    },
    {
      id: 7,
      name: "True Wireless Studio Earbuds",
      brand: "AcousticLab",
      description: "Custom 11mm Drivers, Active Noise Cancellation, IPX4 Water Resistance, Wireless Charging Case, Touch Controls.",
      price: 129.99,
      oldPrice: 159.99,
      rating: 4.4,
      reviewCount: 73,
      stockQuantity: 22,
      inStock: true,
      featured: false,
      imageUrl: "img/headphones.png",
      categoryId: 3,
      categoryName: "Audio & Headphones"
    },
    {
      id: 8,
      name: "Slim Protective Case for Flagship Phone",
      brand: "NovaTech",
      description: "Drop-tested military grade protection, Anti-yellowing TPU material, Raised bezels for screen & camera protection.",
      price: 24.99,
      oldPrice: 29.99,
      rating: 4.3,
      reviewCount: 41,
      stockQuantity: 100,
      inStock: true,
      featured: false,
      imageUrl: "img/smartphone.png",
      categoryId: 2,
      categoryName: "Smartphones & Tablets"
    }
  ],

  currentUser: {
    id: 1,
    fullName: "John Customer",
    email: "john@example.com",
    role: "ROLE_CUSTOMER"
  }
};
