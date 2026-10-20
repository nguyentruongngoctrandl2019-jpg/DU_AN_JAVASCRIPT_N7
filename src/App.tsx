/**
 * CT Tech Store - React Integration & Quick Launcher
 * Provides seamless integration with Vite's React environment
 * and instant routing to all store pages.
 */
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-black flex items-center justify-center text-2xl mx-auto shadow-lg shadow-blue-500/20">
          CT
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">CT TECH STORE</h1>
          <p className="text-xs text-cyan-400 font-semibold tracking-wider mt-1 uppercase">Thế Giới Công Nghệ Đỉnh Cao</p>
          <p className="text-xs text-slate-400 mt-2">Trang web thương mại điện tử công nghệ tối ưu tải nhanh với HTML5, Tailwind CSS và JavaScript thuần.</p>
        </div>

        <div className="space-y-2 text-xs text-left">
          <a href="/index.html" className="block p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center transition-colors shadow-md">
            Mở Trang Chủ (index.html) →
          </a>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a href="/products.html" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-center font-medium hover:text-cyan-400 transition-colors">
              Sản phẩm
            </a>
            <a href="/cart.html" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-center font-medium hover:text-cyan-400 transition-colors">
              Giỏ hàng
            </a>
            <a href="/checkout.html" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-center font-medium hover:text-cyan-400 transition-colors">
              Thanh toán & PDF
            </a>
            <a href="/profile.html" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-center font-medium hover:text-cyan-400 transition-colors">
              Lịch sử đơn
            </a>
            <a href="/login.html" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-center font-medium hover:text-cyan-400 transition-colors">
              Đăng nhập
            </a>
            <a href="/admin.html" className="p-2.5 rounded-lg bg-slate-900 border border-amber-800/60 text-amber-400 text-center font-bold hover:bg-amber-950/30 transition-colors">
              Quản trị Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
