/**
 * Admin Dashboard JavaScript Module
 * Xử lý CRUD sản phẩm và hiển thị đơn hàng dựa trên data.json & LocalStorage
 */

let categories = [];
let products = [];
let orders = [];

// Khởi tạo ứng dụng Admin
async function initAdmin() {
  await loadInitialData();
  setupEventListeners();
  renderCategoryFilter();
  renderProductCategoryOptions();
  renderProducts();
  renderOrders();
  updateStats();
}

// 1. Tải dữ liệu ban đầu từ data.json hoặc LocalStorage
async function loadInitialData() {
  const localProducts = localStorage.getItem('admin_products');
  const localOrders = localStorage.getItem('admin_orders');

  try {
    const res = await fetch('/data.json');
    const data = await res.json();
    categories = data.categories || [];
    products = localProducts ? JSON.parse(localProducts) : (data.products || []);
    orders = localOrders ? JSON.parse(localOrders) : (data.orders || []);
  } catch (err) {
    console.error('Không thể tải data.json:', err);
  }
}

// Lưu dữ liệu vào LocalStorage
function saveProductsToStorage() {
  localStorage.setItem('admin_products', JSON.stringify(products));
}

// 2. Cập nhật Thống kê
function updateStats() {
  document.getElementById('stat-products').textContent = products.length;
  document.getElementById('stat-categories').textContent = categories.length;
  document.getElementById('stat-orders').textContent = orders.length;
}

// 3. Render lọc danh mục
function renderCategoryFilter() {
  const select = document.getElementById('filter-category');
  select.innerHTML = '<option value="">Tất cả danh mục</option>' + 
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderProductCategoryOptions() {
  const select = document.getElementById('form-category');
  select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// 4. Render Danh sách Sản phẩm
function renderProducts() {
  const tbody = document.getElementById('product-list');
  const searchVal = document.getElementById('search-product').value.toLowerCase();
  const categoryVal = document.getElementById('filter-category').value;

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchVal);
    const matchCategory = categoryVal ? String(p.cate_id) === String(categoryVal) : true;
    return matchSearch && matchCategory;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Không tìm thấy sản phẩm nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const category = categories.find(c => String(c.id) === String(p.cate_id));
    const catName = category ? category.name : 'Chưa phân loại';

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-3.5 font-bold text-slate-500">#${p.id}</td>
        <td class="p-3.5">
          <img src="${p.image || 'https://picsum.photos/400/400'}" alt="${p.name}" class="w-10 h-10 object-cover rounded-lg border border-slate-200" />
        </td>
        <td class="p-3.5 font-bold text-slate-900">${p.name}</td>
        <td class="p-3.5"><span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">${catName}</span></td>
        <td class="p-3.5 text-slate-500 max-w-xs truncate" title="${p.detail}">${p.detail}</td>
        <td class="p-3.5 text-right space-x-2">
          <button onclick="window.editProduct(${p.id})" class="px-2.5 py-1 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold cursor-pointer">Sửa</button>
          <button onclick="window.deleteProduct(${p.id})" class="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg font-semibold cursor-pointer">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Render Danh sách Đơn hàng
function renderOrders() {
  const tbody = document.getElementById('order-list');
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-400">Không có đơn hàng.</td></tr>`;
    return;
  }

  const statusBadges = {
    pending: '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Chờ xử lý</span>',
    confirmed: '<span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Đã xác nhận</span>',
    shipping: '<span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">Đang giao</span>',
    completed: '<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Hoàn thành</span>',
    cancelled: '<span class="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold">Đã hủy</span>'
  };

  tbody.innerHTML = orders.map(o => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="p-3.5 font-bold text-slate-900">#${o.id}</td>
      <td class="p-3.5">User #${o.user_id}</td>
      <td class="p-3.5 text-slate-500">${o.created_date}</td>
      <td class="p-3.5">${statusBadges[o.status] || o.status}</td>
    </tr>
  `).join('');
}

// 6. Xử lý Thao tác Sản phẩm (CRUD)
window.editProduct = function(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('modal-title').textContent = 'Chỉnh Sửa Sản Phẩm';
  document.getElementById('form-product-id').value = product.id;
  document.getElementById('form-name').value = product.name;
  document.getElementById('form-category').value = product.cate_id;
  document.getElementById('form-image').value = product.image || '';
  document.getElementById('form-detail').value = product.detail || '';

  document.getElementById('product-modal').classList.remove('hidden');
};

window.deleteProduct = function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    products = products.filter(p => p.id !== id);
    saveProductsToStorage();
    renderProducts();
    updateStats();
  }
};

// 7. Thiết lập Event Listeners
function setupEventListeners() {
  // Tìm kiếm & Lọc
  document.getElementById('search-product').addEventListener('input', renderProducts);
  document.getElementById('filter-category').addEventListener('change', renderProducts);

  // Chuyển Tab Navigation
  const btnProducts = document.getElementById('nav-products');
  const btnOrders = document.getElementById('nav-orders');
  const sectionProducts = document.getElementById('section-products');
  const sectionOrders = document.getElementById('section-orders');
  const pageTitle = document.getElementById('page-title');

  btnProducts.addEventListener('click', () => {
    btnProducts.className = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-700 bg-primary-50 font-semibold text-sm transition-colors cursor-pointer border-r-4 border-primary-600 text-left';
    btnOrders.className = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-colors cursor-pointer text-left';
    sectionProducts.classList.remove('hidden');
    sectionOrders.classList.add('hidden');
    pageTitle.textContent = 'Quản Lý Sản Phẩm';
  });

  btnOrders.addEventListener('click', () => {
    btnOrders.className = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-700 bg-primary-50 font-semibold text-sm transition-colors cursor-pointer border-r-4 border-primary-600 text-left';
    btnProducts.className = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-colors cursor-pointer text-left';
    sectionOrders.classList.remove('hidden');
    sectionProducts.classList.add('hidden');
    pageTitle.textContent = 'Quản Lý Đơn Hàng';
  });

  // Modal
  const modal = document.getElementById('product-modal');
  document.getElementById('btn-add-product').addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('product-form').reset();
    document.getElementById('form-product-id').value = '';
    modal.classList.remove('hidden');
  });

  document.getElementById('close-modal').addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('btn-cancel-modal').addEventListener('click', () => modal.classList.add('hidden'));

  // Submit Form
  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('form-product-id').value;
    const name = document.getElementById('form-name').value;
    const cate_id = Number(document.getElementById('form-category').value);
    const image = document.getElementById('form-image').value || 'https://picsum.photos/400/400';
    const detail = document.getElementById('form-detail').value;

    if (id) {
      // Update
      const index = products.findIndex(p => String(p.id) === String(id));
      if (index !== -1) {
        products[index] = { ...products[index], name, cate_id, image, detail };
      }
    } else {
      // Create
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      products.unshift({ id: newId, name, cate_id, image, detail });
    }

    saveProductsToStorage();
    renderProducts();
    updateStats();
    modal.classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', initAdmin);