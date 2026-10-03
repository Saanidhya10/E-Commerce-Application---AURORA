// TechMart Electronics - REST API Client Module
// Connects to Spring Boot Backend (http://localhost:8080/api/v1)

const BASE_URL = 'http://localhost:8080/api/v1';

window.API = {
  isBackendConnected: false,

  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${BASE_URL}/categories`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.isBackendConnected = true;
        return true;
      }
    } catch (e) {
      this.isBackendConnected = false;
    }
    return false;
  },

  // --- Categories ---
  async getCategories() {
    if (!this.isBackendConnected) return window.ECOM_INITIAL_DATA.categories;
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.warn("REST API getCategories error, using initial data", e);
      return window.ECOM_INITIAL_DATA.categories;
    }
  },

  // --- Products ---
  async getProducts() {
    if (!this.isBackendConnected) return window.ECOM_INITIAL_DATA.products;
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.warn("REST API getProducts error, using initial data", e);
      return window.ECOM_INITIAL_DATA.products;
    }
  },

  async searchProducts(query, categoryId, minPrice, maxPrice) {
    if (!this.isBackendConnected) {
      let filtered = [...window.ECOM_INITIAL_DATA.products];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (categoryId) {
        filtered = filtered.filter(p => p.categoryId == categoryId);
      }
      if (minPrice) {
        filtered = filtered.filter(p => p.price >= minPrice);
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= maxPrice);
      }
      return filtered;
    }

    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (categoryId) params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await fetch(`${BASE_URL}/products/search?${params.toString()}`);
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.warn("REST API search error", e);
      return window.ECOM_INITIAL_DATA.products;
    }
  },

  async createProduct(productDto) {
    if (!this.isBackendConnected) {
      const newProduct = {
        id: window.ECOM_INITIAL_DATA.products.length + 1,
        ...productDto,
        rating: 5.0,
        reviewCount: 1,
        inStock: productDto.stockQuantity > 0,
        categoryName: window.ECOM_INITIAL_DATA.categories.find(c => c.id == productDto.categoryId)?.name || 'General'
      };
      window.ECOM_INITIAL_DATA.products.push(newProduct);
      return newProduct;
    }

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to create product");
    return json.data;
  },

  async updateProduct(id, productDto) {
    if (!this.isBackendConnected) {
      const idx = window.ECOM_INITIAL_DATA.products.findIndex(p => p.id == id);
      if (idx !== -1) {
        window.ECOM_INITIAL_DATA.products[idx] = { ...window.ECOM_INITIAL_DATA.products[idx], ...productDto };
        return window.ECOM_INITIAL_DATA.products[idx];
      }
      throw new Error("Product not found");
    }

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to update product");
    return json.data;
  },

  async deleteProduct(id) {
    if (!this.isBackendConnected) {
      window.ECOM_INITIAL_DATA.products = window.ECOM_INITIAL_DATA.products.filter(p => p.id != id);
      return true;
    }

    const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to delete product");
    return true;
  },

  // --- Authentication ---
  async login(email, password) {
    if (!this.isBackendConnected) {
      if (email === "admin@techmart.com" && password === "admin123") {
        return { token: "demo-jwt-admin", userId: 2, fullName: "Admin User", email: email, role: "ROLE_ADMIN" };
      }
      return { token: "demo-jwt-customer", userId: 1, fullName: "John Customer", email: email, role: "ROLE_CUSTOMER" };
    }

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Authentication failed");
    return json.data;
  },

  async register(registerDto) {
    if (!this.isBackendConnected) {
      return { token: "demo-jwt-new", userId: 99, fullName: registerDto.fullName, email: registerDto.email, role: "ROLE_CUSTOMER" };
    }

    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Registration failed");
    return json.data;
  },

  // --- Order Creation ---
  async createOrder(orderRequestDto) {
    if (!this.isBackendConnected) {
      return {
        id: Date.now(),
        orderNumber: "ORD-" + Date.now().toString().slice(-6),
        status: "PROCESSING",
        totalAmount: orderRequestDto.totalAmount || 0,
        createdAt: new Date().toISOString()
      };
    }

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderRequestDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Order creation failed");
    return json.data;
  }
};
