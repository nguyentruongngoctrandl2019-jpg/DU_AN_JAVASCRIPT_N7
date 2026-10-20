/**
 * CT Tech Store - Master Application JavaScript Engine
 * Modern Vanilla JS Architecture with LocalStorage Persistence,
 * Auth, Cart, Checkout, Order Tracking, Admin CRUD & PDF Invoice Generation.
 */

const CTTech = (function () {
  'use strict';

  const STORAGE_KEYS = {
    PRODUCTS: 'ct_products_v1',
    CART: 'ct_cart_v1',
    USERS: 'ct_users_v1',
    CURRENT_USER: 'ct_current_user_v1',
    ORDERS: 'ct_orders_v1',
    COUPON: 'ct_coupon_v1'
  };

  // Pre-seeded Initial Accounts
  const DEFAULT_USERS = [
    {
      id: 'usr-admin',
      name: 'Nguyễn Văn Admin',
      email: 'admin@cttech.vn',
      password: 'admin',
      phone: '0988889999',
      address: 'Trụ sở CT Tech, 68 Đường Cầu Giấy, Hà Nội',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15'
    },
    {
      id: 'usr-customer',
      name: 'Trần Tuấn Kiệt',
      email: 'user@cttech.vn',
      password: '123',
      phone: '0912345678',
      address: '123 Đường Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà Nội',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-02-10'
    }
  ];

  // Pre-seeded Initial Orders for history showcase
  const DEFAULT_ORDERS = [
    {
      id: 'CT-2026-8812',
      date: '2026-10-18T14:30:00Z',
      customer: {
        name: 'Trần Tuấn Kiệt',
        email: 'user@cttech.vn',
        phone: '0912345678',
        address: '123 Đường Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà Nội',
        note: 'Giao giờ hành chính, gọi trước 15 phút'
      },
      items: [
        {
          productId: 'ct-004',
          name: 'Sony WH-1000XM5 Wireless Headphones',
          price: 7490000,
          quantity: 1,
          color: 'Đen Huyền Bí',
          storage: 'Bản Tiêu Chuẩn',
          image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
        },
        {
          productId: 'ct-009',
          name: 'Chuột không dây Logitech MX Master 3S',
          price: 2290000,
          quantity: 1,
          color: 'Graphite Đen Xám',
          storage: 'Bản Quốc Tế',
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
        }
      ],
      subtotal: 9780000,
      discount: 978000,
      shippingFee: 0,
      total: 8802000,
      couponCode: 'CTTECH10',
      paymentMethod: 'vietqr',
      paymentMethodLabel: 'Chuyển khoản Ngân hàng (VietQR)',
      paymentStatus: 'Đã thanh toán',
      orderStatus: 'Đang giao hàng',
      trackingCode: 'VNPOST-8812993'
    },
    {
      id: 'CT-2026-8790',
      date: '2026-10-12T09:15:00Z',
      customer: {
        name: 'Trần Tuấn Kiệt',
        email: 'user@cttech.vn',
        phone: '0912345678',
        address: '123 Đường Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà Nội',
        note: 'Để ở quầy lễ tân tầng 1'
      },
      items: [
        {
          productId: 'ct-008',
          name: 'Tai nghe Apple AirPods Pro 2 USB-C',
          price: 5490000,
          quantity: 1,
          color: 'Trắng Chuẩn Apple',
          storage: 'Hộp sạc MagSafe USB-C',
          image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80'
        }
      ],
      subtotal: 5490000,
      discount: 0,
      shippingFee: 0,
      total: 5490000,
      couponCode: null,
      paymentMethod: 'card',
      paymentMethodLabel: 'Thẻ tín dụng / Ghi nợ Quốc tế (Visa)',
      paymentStatus: 'Đã thanh toán',
      orderStatus: 'Hoàn thành',
      trackingCode: 'GHTK-5541920'
    }
  ];

  /* ------------------- Initializer ------------------- */
  async function initDatabase() {
    // 1. Initialize Users
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    // 2. Default logged-in user if none
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[1])); // Logged in as demo user
    }
    // 3. Initialize Orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    // 4. Initialize Products from data.json if not present
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      try {
        const response = await fetch('/data.json');
        if (response.ok) {
          const data = await response.json();
          if (data && data.products) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
          }
        }
      } catch (err) {
        console.warn('Could not fetch data.json directly, fallback local store');
      }
    }
  }

  /* ------------------- Product Management ------------------- */
  function getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  }

  function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id || String(p.id) === String(id));
  }

  function saveProduct(product) {
    const products = getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...product };
    } else {
      if (!product.id) {
        product.id = 'ct-' + Date.now().toString().slice(-4);
      }
      products.unshift(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  }

  function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id && String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  }

  async function resetDemoData() {
    try {
      const response = await fetch('/data.json');
      if (response.ok) {
        const data = await response.json();
        if (data && data.products) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
        }
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!', 'success');
  }

  /* ------------------- Cart Management ------------------- */
  function getCart() {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartUI();
    window.dispatchEvent(new CustomEvent('ct-cart-updated', { detail: { cart } }));
  }

  function addToCart(productId, quantity = 1, color = '', storage = '') {
    const product = getProductById(productId);
    if (!product) {
      showToast('Sản phẩm không tồn tại!', 'error');
      return false;
    }

    const selectedColor = color || (product.colors && product.colors[0]) || '';
    const selectedStorage = storage || (product.storageOptions && product.storageOptions[0]) || '';

    const cart = getCart();
    const existingIndex = cart.findIndex(item => 
      item.productId === product.id && 
      item.color === selectedColor && 
      item.storage === selectedStorage
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += Number(quantity);
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        color: selectedColor,
        storage: selectedStorage,
        quantity: Number(quantity)
      });
    }

    saveCart(cart);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    return true;
  }

  function updateCartQty(index, newQty) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
      if (newQty <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = Math.max(1, Math.min(99, newQty));
      }
      saveCart(cart);
    }
  }

  function removeFromCart(index) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
      const removedName = cart[index].name;
      cart.splice(index, 1);
      saveCart(cart);
      showToast(`Đã xóa "${removedName}" khỏi giỏ hàng.`, 'info');
    }
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  }

  function getCartSubtotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  function getAppliedCoupon() {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPON);
    return raw ? JSON.parse(raw) : null;
  }

  function applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'CTTECH10') {
      const coupon = { code: 'CTTECH10', discountPercent: 10, label: 'Giảm 10% tổng đơn hàng' };
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(coupon));
      showToast('Áp dụng thành công mã giảm 10%!', 'success');
      window.dispatchEvent(new CustomEvent('ct-coupon-updated'));
      return { success: true, coupon };
    } else if (cleanCode === 'FREESHIP') {
      const coupon = { code: 'FREESHIP', discountPercent: 0, freeShipping: true, label: 'Miễn phí vận chuyển toàn quốc' };
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(coupon));
      showToast('Áp dụng mã miễn phí giao hàng!', 'success');
      window.dispatchEvent(new CustomEvent('ct-coupon-updated'));
      return { success: true, coupon };
    } else {
      showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
      return { success: false, message: 'Mã không hợp lệ' };
    }
  }

  function removeCoupon() {
    localStorage.removeItem(STORAGE_KEYS.COUPON);
    window.dispatchEvent(new CustomEvent('ct-coupon-updated'));
  }

  function getCartSummary() {
    const subtotal = getCartSubtotal();
    const coupon = getAppliedCoupon();
    let discount = 0;
    let shippingFee = subtotal > 10000000 ? 0 : 50000; // Free shipping > 10 triệu
    if (coupon) {
      if (coupon.discountPercent) {
        discount = Math.round(subtotal * (coupon.discountPercent / 100));
      }
      if (coupon.freeShipping) {
        shippingFee = 0;
      }
    }
    const total = Math.max(0, subtotal - discount + shippingFee);
    return {
      subtotal,
      discount,
      shippingFee,
      total,
      coupon
    };
  }

  /* ------------------- Auth Management ------------------- */
  function getUsers() {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  }

  function getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  function login(email, password) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      updateNavbarAuth();
      showToast(`Chào mừng ${user.name} đã quay trở lại!`, 'success');
      return { success: true, user };
    }
    return { success: false, message: 'Email hoặc mật khẩu không chính xác.' };
  }

  function register(userData) {
    const users = getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email này đã được đăng ký tài khoản!' };
    }
    const newUser = {
      id: 'usr-' + Date.now().toString().slice(-4),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    updateNavbarAuth();
    showToast('Đăng ký tài khoản thành công! Tự động đăng nhập.', 'success');
    return { success: true, user: newUser };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    updateNavbarAuth();
    showToast('Đã đăng xuất tài khoản.', 'info');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 400);
  }

  function updateProfile(updatedData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
      updateNavbarAuth();
      showToast('Cập nhật thông tin tài khoản thành công!', 'success');
      return true;
    }
    return false;
  }

  /* ------------------- Order Operations ------------------- */
  function getAllOrders() {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : DEFAULT_ORDERS;
  }

  function getUserOrders(email) {
    const orders = getAllOrders();
    const user = getCurrentUser();
    const targetEmail = (email || (user && user.email) || '').toLowerCase();
    if (!targetEmail) return [];
    return orders.filter(o => o.customer && o.customer.email.toLowerCase() === targetEmail);
  }

  function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(o => o.id === orderId);
  }

  function createOrder(orderPayload) {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Giỏ hàng đang trống!', 'error');
      return null;
    }
    const summary = getCartSummary();
    const orderId = 'CT-2026-' + Math.floor(1000 + Math.random() * 9000);
    const trackingCode = 'CTSHIP-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: orderPayload.customer,
      items: [...cart],
      subtotal: summary.subtotal,
      discount: summary.discount,
      shippingFee: summary.shippingFee,
      total: summary.total,
      couponCode: summary.coupon ? summary.coupon.code : null,
      paymentMethod: orderPayload.paymentMethod,
      paymentMethodLabel: orderPayload.paymentMethodLabel || 'Chuyển khoản / Trực tuyến',
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'Chưa thanh toán (COD)' : 'Đã thanh toán',
      orderStatus: 'Chờ xử lý',
      trackingCode: trackingCode
    };

    const allOrders = getAllOrders();
    allOrders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));

    // Clear cart and coupon after order placement
    clearCart();
    removeCoupon();

    return newOrder;
  }

  function updateOrderStatus(orderId, newStatus) {
    const allOrders = getAllOrders();
    const index = allOrders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      allOrders[index].orderStatus = newStatus;
      if (newStatus === 'Hoàn thành' && allOrders[index].paymentStatus.includes('Chưa thanh toán')) {
        allOrders[index].paymentStatus = 'Đã thanh toán';
      }
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
      showToast(`Đơn hàng #${orderId} đã đổi trạng thái: ${newStatus}`, 'success');
      return true;
    }
    return false;
  }

  /* ------------------- Formatting & Helpers ------------------- */
  function formatVND(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
    return Number(amount).toLocaleString('vi-VN') + ' ₫';
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('ct-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ct-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `ct-toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `<span class="font-bold mr-1 text-sm">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function updateCartUI() {
    const count = getCartCount();
    document.querySelectorAll('.ct-cart-badge').forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  function updateNavbarAuth() {
    const user = getCurrentUser();
    document.querySelectorAll('.ct-user-auth-slot').forEach(slot => {
      if (user) {
        slot.innerHTML = `
          <div class="relative group">
            <button class="flex items-center gap-2 py-1 px-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm text-slate-200">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}" alt="${user.name}" class="w-7 h-7 rounded-full object-cover border border-slate-700" />
              <span class="font-medium max-w-[110px] truncate hidden sm:inline">${user.name.split(' ').slice(-1)[0]}</span>
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 hidden group-hover:block hover:block z-50">
              <div class="px-4 py-2 border-b border-slate-800">
                <p class="text-xs text-slate-400">Đăng nhập với</p>
                <p class="text-sm font-semibold text-white truncate">${user.name}</p>
                <span class="inline-block text-[11px] font-mono text-cyan-400">${user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span>
              </div>
              <a href="/profile.html" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Tài khoản & Đơn hàng
              </a>
              ${user.role === 'admin' ? `
                <a href="/admin.html" class="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:bg-slate-800 transition-colors">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Trang Quản trị Admin
                </a>
              ` : ''}
              <button onclick="CTTech.logout()" class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors">
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Đăng xuất
              </button>
            </div>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <a href="/login.html" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            Đăng nhập
          </a>
        `;
      }
    });
  }

  /* ------------------- Print & PDF Generation ------------------- */
  function printReceipt(orderId) {
    const order = getOrderById(orderId);
    if (!order) {
      showToast('Không tìm thấy thông tin đơn hàng để in!', 'error');
      return;
    }
    // Open a clean printable receipt in a formatted overlay and call print
    let modal = document.getElementById('ct-print-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ct-print-modal';
      document.body.appendChild(modal);
    }
    modal.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto';
    modal.innerHTML = `
      <div class="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative my-8" id="invoice-printable">
        <div class="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm">CT</span>
              <span class="text-xl font-bold tracking-tight text-slate-900">CT TECH STORE</span>
            </div>
            <p class="text-xs text-slate-500">Mã số thuế: 0108998866 | Hotline: 1900 6868</p>
            <p class="text-xs text-slate-500">Địa chỉ: 68 Đường Cầu Giấy, TP. Hà Nội</p>
          </div>
          <div class="text-right">
            <span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md mb-1">HÓA ĐƠN BÁN HÀNG</span>
            <p class="text-xs font-mono font-bold text-slate-800">Số: #${order.id}</p>
            <p class="text-xs text-slate-500">Ngày: ${formatDate(order.date)}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span class="text-slate-400 block font-medium">Khách hàng:</span>
            <strong class="text-slate-800 text-sm">${order.customer.name}</strong>
            <p class="text-slate-600">SĐT: ${order.customer.phone}</p>
            <p class="text-slate-600">Email: ${order.customer.email}</p>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">Địa chỉ giao hàng:</span>
            <p class="text-slate-700">${order.customer.address}</p>
            <p class="text-slate-500 mt-1">Phương thức: <strong>${order.paymentMethodLabel}</strong></p>
            <p class="text-slate-500">Trạng thái: <span class="text-emerald-600 font-semibold">${order.paymentStatus}</span></p>
          </div>
        </div>

        <table class="w-full text-left text-xs mb-6">
          <thead>
            <tr class="border-b border-slate-300 text-slate-500 font-semibold">
              <th class="py-2">Sản phẩm</th>
              <th class="py-2 text-center">Phân loại</th>
              <th class="py-2 text-center">SL</th>
              <th class="py-2 text-right">Đơn giá</th>
              <th class="py-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${order.items.map(item => `
              <tr>
                <td class="py-3 font-medium text-slate-900">${item.name}</td>
                <td class="py-3 text-center text-slate-500">${[item.color, item.storage].filter(Boolean).join(' - ') || '-'}</td>
                <td class="py-3 text-center font-mono">${item.quantity}</td>
                <td class="py-3 text-right tabular-nums text-slate-600">${formatVND(item.price)}</td>
                <td class="py-3 text-right tabular-nums font-semibold text-slate-900">${formatVND(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="border-t border-slate-200 pt-4 mb-6 space-y-1 text-xs text-right">
          <div class="flex justify-between text-slate-600">
            <span>Tạm tính:</span>
            <span class="tabular-nums font-medium">${formatVND(order.subtotal)}</span>
          </div>
          ${order.discount > 0 ? `
            <div class="flex justify-between text-emerald-600">
              <span>Giảm giá khuyến mãi (${order.couponCode || 'CTTECH10'}):</span>
              <span class="tabular-nums font-medium">-${formatVND(order.discount)}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-slate-600">
            <span>Phí vận chuyển:</span>
            <span class="tabular-nums font-medium">${order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2 mt-2">
            <span>TỔNG THANH TOÁN:</span>
            <span class="text-blue-600 tabular-nums">${formatVND(order.total)}</span>
          </div>
        </div>

        <div class="text-center border-t border-dashed border-slate-200 pt-4 text-[11px] text-slate-400">
          <p class="font-medium text-slate-600">Xin cảm ơn Quý khách đã mua sắm tại CT Tech Store!</p>
          <p>Mọi thắc mắc và bảo hành chính hãng vui lòng gọi 1900 6868 hoặc truy cập https://cttech.vn</p>
        </div>

        <div class="mt-6 flex justify-end gap-3 no-print">
          <button onclick="document.getElementById('ct-print-modal').remove()" class="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">Đóng</button>
          <button onclick="window.print()" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            In hóa đơn ngay
          </button>
        </div>
      </div>
    `;
  }

  async function exportPDF(orderId) {
    const order = getOrderById(orderId);
    if (!order) {
      showToast('Không tìm thấy đơn hàng để xuất PDF!', 'error');
      return;
    }

    showToast('Đang tạo và tải hóa đơn PDF...', 'info');

    try {
      // Check if jsPDF exists, or load dynamically
      let jsPDFClass = window.jspdf && window.jspdf.jsPDF;
      if (!jsPDFClass) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load jsPDF'));
          document.head.appendChild(script);
        });
        jsPDFClass = window.jspdf.jsPDF;
      }

      const doc = new jsPDFClass({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryBlue = [37, 99, 235];
      const darkSlate = [15, 23, 42];
      const lightGray = [241, 245, 249];
      const mutedText = [100, 116, 139];

      // Store Header Banner
      doc.setFillColor(...primaryBlue);
      doc.rect(0, 0, 210, 26, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('CT TECH STORE - OFFICIAL INVOICE', 14, 15);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Hotline: 1900 6868  |  Website: cttech.vn  |  Tax ID: 0108998866', 14, 21);

      // Invoice Meta info
      doc.setTextColor(...darkSlate);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`INVOICE: #${order.id}`, 14, 38);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedText);
      doc.text(`Date: ${formatDate(order.date)}`, 14, 44);
      doc.text(`Tracking Code: ${order.trackingCode || 'CTSHIP-8812'}`, 14, 49);

      // Customer box
      doc.setFillColor(...lightGray);
      doc.roundedRect(14, 54, 182, 28, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkSlate);
      doc.setFontSize(9);
      doc.text('BILL TO:', 18, 61);
      doc.text('PAYMENT DETAILS:', 110, 61);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`Customer: ${order.customer.name}`, 18, 67);
      doc.text(`Phone: ${order.customer.phone} | Email: ${order.customer.email}`, 18, 72);
      doc.text(`Address: ${order.customer.address}`, 18, 77);

      doc.text(`Method: ${order.paymentMethodLabel}`, 110, 67);
      doc.text(`Status: ${order.paymentStatus}`, 110, 72);

      // Table Header
      let y = 92;
      doc.setFillColor(30, 41, 59);
      doc.rect(14, y, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Item Description', 18, y + 5.5);
      doc.text('Qty', 115, y + 5.5, { align: 'center' });
      doc.text('Unit Price (VND)', 148, y + 5.5, { align: 'right' });
      doc.text('Total (VND)', 190, y + 5.5, { align: 'right' });

      // Table Rows
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);

      order.items.forEach((item, idx) => {
        const bg = idx % 2 === 1 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(...bg);
        doc.rect(14, y, 182, 9, 'F');

        const itemName = `${item.name} (${[item.color, item.storage].filter(Boolean).join(', ')})`;
        const truncatedName = itemName.length > 55 ? itemName.substring(0, 52) + '...' : itemName;
        
        doc.text(truncatedName, 18, y + 6);
        doc.text(String(item.quantity), 115, y + 6, { align: 'center' });
        doc.text(formatVND(item.price), 148, y + 6, { align: 'right' });
        doc.text(formatVND(item.price * item.quantity), 190, y + 6, { align: 'right' });
        y += 9;
      });

      // Totals Box
      y += 6;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, 196, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.text('Subtotal:', 140, y);
      doc.text(formatVND(order.subtotal), 190, y, { align: 'right' });
      y += 6;

      if (order.discount > 0) {
        doc.setTextColor(16, 185, 129);
        doc.text(`Discount (${order.couponCode || 'PROMO'}):`, 140, y);
        doc.text(`-${formatVND(order.discount)}`, 190, y, { align: 'right' });
        y += 6;
      }

      doc.setTextColor(30, 30, 30);
      doc.text('Shipping Fee:', 140, y);
      doc.text(order.shippingFee === 0 ? 'Free' : formatVND(order.shippingFee), 190, y, { align: 'right' });
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...primaryBlue);
      doc.text('TOTAL AMOUNT:', 130, y);
      doc.text(formatVND(order.total), 190, y, { align: 'right' });

      // Footer note & stamp
      y += 24;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...mutedText);
      doc.text('Thank you for choosing CT Tech Store! Warranty & returns covered within 30 days.', 14, y);
      doc.text('Official Digital Invoice authenticated by CT Tech Vietnam System.', 14, y + 5);

      // Save PDF
      doc.save(`Hoa-don-CTTech-${order.id}.pdf`);
      showToast('Đã tải hóa đơn PDF thành công!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Không thể tạo PDF tự động, chuyển sang chế độ in...', 'error');
      printReceipt(orderId);
    }
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', async () => {
    await initDatabase();
    updateCartUI();
    updateNavbarAuth();

    // Mobile nav toggle handler if present
    const mobileBtn = document.getElementById('ct-mobile-menu-btn');
    const mobileMenu = document.getElementById('ct-mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Global quick search handler
    const searchInputs = document.querySelectorAll('.ct-search-input');
    searchInputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = encodeURIComponent(e.target.value.trim());
          if (query) {
            window.location.href = `/products.html?search=${query}`;
          }
        }
      });
    });
  });

  return {
    initDatabase,
    getProducts,
    getProductById,
    saveProduct,
    deleteProduct,
    resetDemoData,
    getCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartSubtotal,
    getAppliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartSummary,
    getUsers,
    getCurrentUser,
    login,
    register,
    logout,
    updateProfile,
    getAllOrders,
    getUserOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    formatVND,
    formatDate,
    showToast,
    updateCartUI,
    updateNavbarAuth,
    printReceipt,
    exportPDF
  };
})();

// Attach to window for global access
window.CTTech = CTTech;
