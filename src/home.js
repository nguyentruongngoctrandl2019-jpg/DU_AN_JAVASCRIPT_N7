/**
 * CT Tech Store - Homepage Interactive Controller
 * Powers Hero banners, Flash Sale countdowns, category tabs, and product cards.
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof CTTech === 'undefined') return;
  await CTTech.initDatabase();

  renderHeroSlider();
  renderFlashDeals();
  renderFeaturedProducts();
  initCountdownTimer();
  initNewsletter();
});

function renderHeroSlider() {
  const slides = [
    {
      title: "iPhone 16 Pro Max",
      subtitle: "Khung Titanium Vũ Trụ. Đột Phá Chip Apple A18 Pro.",
      desc: "Trải nghiệm sức mạnh xử lý AI đỉnh cao, Camera Control siêu nhạy và thời lượng pin đột phá dẫn đầu thế giới.",
      price: "Từ 34.990.000 ₫",
      tag: "FLAGSHIP MỚI NHẤT",
      link: "/product-detail.html?id=ct-001",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "MacBook Pro 16\" M3 Max",
      subtitle: "Quái thú đồ họa & AI cho kỹ sư, chuyên gia.",
      desc: "Màn hình Liquid Retina XDR 120Hz đỉnh cao, 48GB Unified RAM và thời lượng pin siêu bền bỉ lên đến 22 giờ liên tục.",
      price: "Từ 79.990.000 ₫",
      tag: "WORKSTATION DI ĐỘNG",
      link: "/product-detail.html?id=ct-002",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "Samsung Galaxy S24 Ultra",
      subtitle: "Quyền năng Galaxy AI. Bút S-Pen tối thượng.",
      desc: "Zoom mắt thần bóng đêm 100x, khung Titan siêu bền và màn hình phẳng Dynamic AMOLED 2X 2600 nits đỉnh sáng.",
      price: "Từ 28.990.000 ₫",
      tag: "GALAXY AI ĐỈNH CAO",
      link: "/product-detail.html?id=ct-003",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"
    }
  ];

  const container = document.getElementById('hero-slider-content');
  if (!container) return;

  let currentSlide = 0;

  function displaySlide(idx) {
    const s = slides[idx];
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px] py-6 animate-fade-in">
        <div class="lg:col-span-7 space-y-5 text-left">
          <div class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1 rounded-full">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            ${s.tag}
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            ${s.title}
          </h1>
          <p class="text-lg text-slate-300 font-medium">${s.subtitle}</p>
          <p class="text-sm text-slate-400 max-w-xl leading-relaxed">${s.desc}</p>
          
          <div class="pt-2 flex flex-wrap items-center gap-4">
            <div class="text-2xl font-black text-white tabular-nums">${s.price}</div>
            <a href="${s.link}" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
              Xem chi tiết
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
            <a href="/products.html" class="px-5 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors">
              Khám phá tất cả
            </a>
          </div>
        </div>

        <div class="lg:col-span-5 flex justify-center items-center">
          <div class="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/50 p-2">
            <img src="${s.image}" alt="${s.title}" class="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105" />
          </div>
        </div>
      </div>
    `;

    // Update dots
    const dotsContainer = document.getElementById('hero-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((_, i) => `
        <button class="w-2.5 h-2.5 rounded-full transition-all ${i === idx ? 'bg-blue-500 w-8' : 'bg-slate-700 hover:bg-slate-500'}" onclick="window.setHeroSlide(${i})"></button>
      `).join('');
    }
  }

  window.setHeroSlide = (i) => {
    currentSlide = i;
    displaySlide(currentSlide);
  };

  displaySlide(0);

  // Auto rotate every 6 seconds
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    displaySlide(currentSlide);
  }, 6000);
}

function renderFlashDeals() {
  const container = document.getElementById('flash-deals-grid');
  if (!container) return;

  const products = CTTech.getProducts();
  const flashProducts = products.filter(p => p.isFlashSale).slice(0, 4);

  container.innerHTML = flashProducts.map(p => `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between product-card group">
      <div>
        <div class="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-4">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
            -${p.discount || 10}%
          </div>
          ${p.badge ? `
            <div class="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur text-cyan-300 text-[10px] font-semibold px-2 py-0.5 rounded">
              ${p.badge}
            </div>
          ` : ''}
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span class="font-semibold text-blue-600 uppercase tracking-wider">${p.brand}</span>
          <span>·</span>
          <span>${p.categoryName}</span>
        </div>

        <h3 class="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
          <a href="/product-detail.html?id=${p.id}">${p.name}</a>
        </h3>

        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-base font-extrabold text-red-600 tabular-nums">${CTTech.formatVND(p.price)}</span>
          ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through tabular-nums">${CTTech.formatVND(p.oldPrice)}</span>` : ''}
        </div>

        <div class="mt-3">
          <div class="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Đã bán: ${p.reviewsCount + 12}</span>
            <span class="text-red-500 font-medium">Sắp cháy hàng</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full" style="width: 78%"></div>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <a href="/product-detail.html?id=${p.id}" class="flex-1 text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          Xem máy
        </a>
        <button onclick="CTTech.addToCart('${p.id}')" class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1" title="Thêm vào giỏ">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-tech-grid');
  if (!container) return;

  const products = CTTech.getProducts();
  const featured = products.slice(0, 8);

  container.innerHTML = featured.map(p => `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between product-card group">
      <div>
        <div class="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-4">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            ${p.brand}
          </div>
        </div>

        <div class="text-xs text-slate-500 mb-1">
          <span>${p.categoryName}</span>
          <span class="mx-1">·</span>
          <span class="text-amber-500 font-semibold">★ ${p.rating}</span>
          <span class="text-slate-400">(${p.reviewsCount})</span>
        </div>

        <h3 class="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
          <a href="/product-detail.html?id=${p.id}">${p.name}</a>
        </h3>

        <p class="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
          ${p.description}
        </p>

        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-base font-extrabold text-blue-600 tabular-nums">${CTTech.formatVND(p.price)}</span>
          ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through tabular-nums">${CTTech.formatVND(p.oldPrice)}</span>` : ''}
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <a href="/product-detail.html?id=${p.id}" class="flex-1 text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          Chi tiết
        </a>
        <button onclick="CTTech.addToCart('${p.id}')" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm
        </button>
      </div>
    </div>
  `).join('');
}

function initCountdownTimer() {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');
  if (!hoursEl || !minsEl || !secsEl) return;

  // 14 hours countdown from now
  let remainingSeconds = 14 * 3600 + 42 * 60 + 15;

  setInterval(() => {
    if (remainingSeconds <= 0) {
      remainingSeconds = 24 * 3600;
    } else {
      remainingSeconds--;
    }

    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        CTTech.showToast(`Cảm ơn bạn! CT Tech sẽ gửi mã ưu đãi đến ${input.value}`, 'success');
        input.value = '';
      }
    });
  }
}
