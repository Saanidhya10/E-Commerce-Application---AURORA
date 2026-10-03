// TechMart Electronics - Production E-Commerce Frontend Controller

document.addEventListener('DOMContentLoaded', async () => {
  window.EComApp.init();
});

window.EComApp = {
  state: {
    products: [],
    categories: [],
    filteredProducts: [],
    cart: [],
    user: null,
    activeCategory: null,
    searchQuery: '',
    priceMax: 2000,
    sortBy: 'featured',
    selectedQuickViewProduct: null
  },

  async init() {
    // 1. Check Spring Boot API Status
    const isConnected = await window.API.checkBackendHealth();
    this.updateStatusBadge(isConnected);

    // 2. Load Categories & Products
    this.state.categories = await window.API.getCategories();
    this.state.products = await window.API.getProducts();
    this.state.filteredProducts = [...this.state.products];

    // Load stored user or default user
    const savedUser = localStorage.getItem('techmart_user');
    if (savedUser) {
      try { this.state.user = JSON.parse(savedUser); } catch(e){}
    } else {
      this.state.user = window.ECOM_INITIAL_DATA.currentUser;
    }

    // Load saved cart
    const savedCart = localStorage.getItem('techmart_cart');
    if (savedCart) {
      try { this.state.cart = JSON.parse(savedCart); } catch(e){}
    }

    // 3. Render UI components
    this.renderUserControls();
    this.renderCategoryNav();
    this.renderCategoriesGrid();
    this.applyFilters();
    this.updateCartBadge();
    this.bindEvents();
  },

  updateStatusBadge(isConnected) {
    const badge = document.getElementById('apiStatusBadge');
    if (!badge) return;
    if (isConnected) {
      badge.className = 'status-badge';
      badge.innerHTML = '<span class="status-dot"></span> Backend: Connected (Spring Boot REST API)';
    } else {
      badge.className = 'status-badge standalone';
      badge.innerHTML = '<span class="status-dot"></span> Mode: Standalone Ready (Spring Boot Integrated)';
    }
  },

  renderUserControls() {
    const userBtn = document.getElementById('userAccountBtn');
    const userText = document.getElementById('userAccountText');
    const adminLink = document.getElementById('adminPanelNavLink');

    if (this.state.user) {
      if (userText) userText.textContent = this.state.user.fullName.split(' ')[0];
      if (adminLink) {
        adminLink.style.display = (this.state.user.role === 'ROLE_ADMIN') ? 'block' : 'none';
      }
    } else {
      if (userText) userText.textContent = 'Account';
      if (adminLink) adminLink.style.display = 'none';
    }
  },

  renderCategoryNav() {
    const navMenu = document.getElementById('categoryNavMenu');
    const selectBox = document.getElementById('searchCategorySelect');
    if (!navMenu) return;

    let html = `<li><a href="#" class="${!this.state.activeCategory ? 'active' : ''}" data-cat="all">All Categories</a></li>`;
    let selectHtml = `<option value="">All Categories</option>`;

    this.state.categories.forEach(cat => {
      const activeClass = this.state.activeCategory == cat.id ? 'active' : '';
      html += `<li><a href="#" class="${activeClass}" data-cat="${cat.id}">${cat.name}</a></li>`;
      selectHtml += `<option value="${cat.id}">${cat.name}</option>`;
    });

    navMenu.innerHTML = html;
    if (selectBox) selectBox.innerHTML = selectHtml;
  },

  renderCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    const icons = {
      "Laptops & Computers": "💻",
      "Smartphones & Tablets": "📱",
      "Audio & Headphones": "🎧",
      "Wearables & Smartwatches": "⌚"
    };

    grid.innerHTML = this.state.categories.map(cat => `
      <div class="category-card" data-cat="${cat.id}">
        <div class="category-icon">${icons[cat.name] || '🔌'}</div>
        <div class="category-info">
          <h4>${cat.name}</h4>
          <p>${cat.description || 'Explore top models'}</p>
        </div>
      </div>
    `).join('');
  },

  applyFilters() {
    let result = [...this.state.products];

    // Category Filter
    if (this.state.activeCategory) {
      result = result.filter(p => p.categoryId == this.state.activeCategory);
    }

    // Search Query
    if (this.state.searchQuery.trim()) {
      const q = this.state.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Price Max
    if (this.state.priceMax) {
      result = result.filter(p => p.price <= this.state.priceMax);
    }

    // Sorting
    if (this.state.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.state.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.state.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    this.state.filteredProducts = result;
    this.renderProductGrid();
  },

  renderProductGrid() {
    const grid = document.getElementById('productsGrid');
    const resultCount = document.getElementById('resultCount');
    if (!grid) return;

    if (resultCount) {
      resultCount.textContent = `Showing ${this.state.filteredProducts.length} of ${this.state.products.length} products`;
    }

    if (this.state.filteredProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: white; border: 1px solid var(--border-color); border-radius: 8px;">
          <h3>No matching products found</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Try clearing filters or searching for another term.</p>
          <button class="btn-primary" style="margin-top: 16px;" onclick="EComApp.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.state.filteredProducts.map(product => {
      const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
      const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

      return `
        <div class="product-card">
          <div class="product-image-container">
            ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
            <span class="stock-tag">${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            <img src="${product.imageUrl || 'img/laptop.png'}" alt="${product.name}" />
          </div>
          <div class="product-body">
            <span class="product-category-tag">${product.brand || 'Electronics'}</span>
            <h4 class="product-title">${product.name}</h4>
            <div class="rating-row">
              <span class="stars">${stars}</span>
              <span class="review-count">(${product.reviewCount || 0})</span>
            </div>
            <div class="product-price-row">
              <span class="current-price">$${product.price.toFixed(2)}</span>
              ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-card-actions">
              <button class="btn-add-cart" onclick="EComApp.addToCart(${product.id})">
                🛒 Add to Cart
              </button>
              <button class="btn-quick-view" title="Quick View" onclick="EComApp.openQuickView(${product.id})">
                👁️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  addToCart(productId, qty = 1) {
    const product = this.state.products.find(p => p.id == productId);
    if (!product) return;

    const existingIndex = this.state.cart.findIndex(item => item.productId == productId);
    if (existingIndex > 0 || existingIndex === 0) {
      this.state.cart[existingIndex].quantity += qty;
    } else {
      this.state.cart.push({
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: qty
      });
    }

    localStorage.setItem('techmart_cart', JSON.stringify(this.state.cart));
    this.updateCartBadge();
    this.showToast(`Added "${product.name}" to your cart.`, 'success');
  },

  updateCartBadge() {
    const badge = document.getElementById('cartBadgeCount');
    if (!badge) return;
    const totalQty = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty;
  },

  renderCartModal() {
    const tbody = document.getElementById('cartTableBody');
    const subtotalEl = document.getElementById('cartSubtotal');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');
    if (!tbody) return;

    if (this.state.cart.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: var(--text-muted);">Your shopping cart is currently empty.</td></tr>`;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (taxEl) taxEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    tbody.innerHTML = this.state.cart.map(item => {
      const lineSubtotal = item.price * item.quantity;
      subtotal += lineSubtotal;

      return `
        <tr>
          <td>
            <div class="cart-item-info">
              <img class="cart-item-img" src="${item.imageUrl || 'img/laptop.png'}" alt="${item.name}" />
              <div>
                <strong>${item.name}</strong><br/>
                <span style="font-size: 11px; color: var(--text-muted);">$${item.price.toFixed(2)} each</span>
              </div>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="qty-control">
              <button class="qty-btn" onclick="EComApp.updateCartQty(${item.id}, -1)">-</button>
              <span class="qty-input" style="display:inline-flex; align-items:center; justify-content:center;">${item.quantity}</span>
              <button class="qty-btn" onclick="EComApp.updateCartQty(${item.id}, 1)">+</button>
            </div>
          </td>
          <td>$${lineSubtotal.toFixed(2)}</td>
          <td>
            <button class="btn-outline-danger" onclick="EComApp.removeFromCart(${item.id})">Remove</button>
          </td>
        </tr>
      `;
    }).join('');

    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)} (Estimated)`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  },

  updateCartQty(cartItemId, delta) {
    const idx = this.state.cart.findIndex(i => i.id == cartItemId);
    if (idx !== -1) {
      this.state.cart[idx].quantity += delta;
      if (this.state.cart[idx].quantity <= 0) {
        this.state.cart.splice(idx, 1);
      }
      localStorage.setItem('techmart_cart', JSON.stringify(this.state.cart));
      this.updateCartBadge();
      this.renderCartModal();
    }
  },

  removeFromCart(cartItemId) {
    this.state.cart = this.state.cart.filter(i => i.id != cartItemId);
    localStorage.setItem('techmart_cart', JSON.stringify(this.state.cart));
    this.updateCartBadge();
    this.renderCartModal();
    this.showToast('Item removed from cart.', 'info');
  },

  openQuickView(productId) {
    const product = this.state.products.find(p => p.id == productId);
    if (!product) return;
    this.state.selectedQuickViewProduct = product;

    const modalBody = document.getElementById('quickViewModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="quick-view-grid">
        <img class="quick-view-img" src="${product.imageUrl || 'img/laptop.png'}" alt="${product.name}" />
        <div class="quick-view-details">
          <span class="quick-view-brand">${product.brand}</span>
          <h3>${product.name}</h3>
          <div class="rating-row" style="margin-bottom: 12px;">
            <span class="stars">★★★★★</span>
            <span class="review-count">(${product.reviewCount || 0} reviews)</span>
          </div>
          <div class="product-price-row" style="margin-bottom: 16px;">
            <span class="current-price" style="font-size: 22px;">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="old-price" style="font-size: 15px;">$${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <p class="quick-view-desc">${product.description}</p>
          <div style="margin-bottom: 20px;">
            <span class="status-badge" style="display:inline-flex;">${product.inStock ? 'In Stock (' + product.stockQuantity + ' available)' : 'Out of Stock'}</span>
          </div>
          <div style="display:flex; gap: 10px;">
            <button class="btn-primary" style="flex:1;" onclick="EComApp.addToCart(${product.id}); EComApp.closeModal('quickViewModal');">Add to Shopping Cart</button>
          </div>
        </div>
      </div>
    `;

    this.openModal('quickViewModal');
  },

  async handleCheckout(e) {
    e.preventDefault();
    if (this.state.cart.length === 0) {
      this.showToast('Your cart is empty!', 'error');
      return;
    }

    const address = document.getElementById('checkoutAddress').value;
    const paymentMethod = document.getElementById('checkoutPayment').value;
    const totalAmount = this.state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    try {
      const order = await window.API.createOrder({
        userId: this.state.user ? this.state.user.id : 1,
        shippingAddress: address,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount
      });

      this.state.cart = [];
      localStorage.removeItem('techmart_cart');
      this.updateCartBadge();
      this.closeModal('checkoutModal');
      this.closeModal('cartModal');

      this.showToast(`Order Placed Successfully! Order #${order.orderNumber}`, 'success');
    } catch (err) {
      this.showToast(`Checkout Error: ${err.message}`, 'error');
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const auth = await window.API.login(email, password);
      this.state.user = auth;
      localStorage.setItem('techmart_user', JSON.stringify(auth));
      this.renderUserControls();
      this.closeModal('authModal');
      this.showToast(`Welcome back, ${auth.fullName}!`, 'success');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  },

  async handleAdminSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('adminProductId').value;
    const dto = {
      name: document.getElementById('adminProductName').value,
      brand: document.getElementById('adminProductBrand').value,
      price: parseFloat(document.getElementById('adminProductPrice').value),
      oldPrice: parseFloat(document.getElementById('adminProductOldPrice').value) || null,
      stockQuantity: parseInt(document.getElementById('adminProductStock').value),
      categoryId: parseInt(document.getElementById('adminProductCategory').value),
      imageUrl: document.getElementById('adminProductImage').value || 'img/laptop.png',
      description: document.getElementById('adminProductDesc').value
    };

    try {
      if (id) {
        await window.API.updateProduct(id, dto);
        this.showToast('Product updated successfully!', 'success');
      } else {
        await window.API.createProduct(dto);
        this.showToast('Product created successfully!', 'success');
      }

      this.state.products = await window.API.getProducts();
      this.applyFilters();
      this.closeModal('adminModal');
    } catch (err) {
      this.showToast(`Error: ${err.message}`, 'error');
    }
  },

  async deleteProductAdmin(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await window.API.deleteProduct(id);
      this.showToast('Product deleted.', 'success');
      this.state.products = await window.API.getProducts();
      this.applyFilters();
      this.openAdminModal();
    } catch (err) {
      this.showToast(`Delete Error: ${err.message}`, 'error');
    }
  },

  openAdminModal() {
    const listEl = document.getElementById('adminProductsList');
    if (!listEl) return;

    listEl.innerHTML = this.state.products.map(p => `
      <tr>
        <td>#${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.stockQuantity}</td>
        <td>${p.brand}</td>
        <td>
          <button class="btn-secondary" style="padding: 4px 8px; font-size:12px;" onclick="EComApp.editProductAdmin(${p.id})">Edit</button>
          <button class="btn-outline-danger" style="padding: 4px 8px;" onclick="EComApp.deleteProductAdmin(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');

    this.openModal('adminModal');
  },

  editProductAdmin(id) {
    const p = this.state.products.find(item => item.id == id);
    if (!p) return;
    document.getElementById('adminProductId').value = p.id;
    document.getElementById('adminProductName').value = p.name;
    document.getElementById('adminProductBrand').value = p.brand;
    document.getElementById('adminProductPrice').value = p.price;
    document.getElementById('adminProductOldPrice').value = p.oldPrice || '';
    document.getElementById('adminProductStock').value = p.stockQuantity;
    document.getElementById('adminProductCategory').value = p.categoryId;
    document.getElementById('adminProductImage').value = p.imageUrl || '';
    document.getElementById('adminProductDesc').value = p.description || '';
  },

  resetAdminForm() {
    document.getElementById('adminProductForm').reset();
    document.getElementById('adminProductId').value = '';
  },

  resetFilters() {
    this.state.activeCategory = null;
    this.state.searchQuery = '';
    this.state.priceMax = 2000;
    this.state.sortBy = 'featured';

    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) searchInput.value = '';

    this.renderCategoryNav();
    this.applyFilters();
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
    if (modalId === 'cartModal') this.renderCartModal();
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  },

  bindEvents() {
    // Search Button & Input
    const searchBtn = document.getElementById('headerSearchBtn');
    const searchInput = document.getElementById('headerSearchInput');
    if (searchBtn && searchInput) {
      const doSearch = () => {
        this.state.searchQuery = searchInput.value;
        this.applyFilters();
      };
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') doSearch(); });
    }

    // Category Nav Links
    document.getElementById('categoryNavMenu')?.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) {
        e.preventDefault();
        const cat = a.getAttribute('data-cat');
        this.state.activeCategory = (cat === 'all') ? null : cat;
        this.renderCategoryNav();
        this.applyFilters();
      }
    });

    // Category Cards Click
    document.getElementById('categoriesGrid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) {
        const cat = card.getAttribute('data-cat');
        this.state.activeCategory = cat;
        this.renderCategoryNav();
        this.applyFilters();
        window.scrollTo({ top: 450, behavior: 'smooth' });
      }
    });

    // Price Filter Slider
    const priceRange = document.getElementById('priceRangeInput');
    const priceVal = document.getElementById('priceRangeVal');
    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        this.state.priceMax = parseFloat(e.target.value);
        if (priceVal) priceVal.textContent = `$${this.state.priceMax}`;
        this.applyFilters();
      });
    }

    // Sort Dropdown
    document.getElementById('sortProductsSelect')?.addEventListener('change', (e) => {
      this.state.sortBy = e.target.value;
      this.applyFilters();
    });

    // Cart Modal Trigger
    document.getElementById('headerCartBtn')?.addEventListener('click', () => {
      this.openModal('cartModal');
    });

    // Account Modal Trigger
    document.getElementById('userAccountBtn')?.addEventListener('click', () => {
      this.openModal('authModal');
    });

    // Checkout Modal Trigger
    document.getElementById('proceedCheckoutBtn')?.addEventListener('click', () => {
      if (this.state.cart.length === 0) {
        this.showToast('Your cart is empty!', 'error');
        return;
      }
      this.openModal('checkoutModal');
    });

    // Admin Panel Link
    document.getElementById('adminPanelNavLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openAdminModal();
    });

    // Forms
    document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('checkoutForm')?.addEventListener('submit', (e) => this.handleCheckout(e));
    document.getElementById('adminProductForm')?.addEventListener('submit', (e) => this.handleAdminSaveProduct(e));
  }
};
