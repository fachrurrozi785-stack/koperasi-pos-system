import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportAPI } from '../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const { data: salesReport } = useQuery(
    ['sales', today],
    () => reportAPI.getSalesReport(today, today).then(r => r.data.data)
  );

  const { data: profitLossReport } = useQuery(
    ['profitLoss'],
    () => reportAPI.getProfitLossReport(today, today).then(r => r.data.data)
  );

  const mockChartData = [
    { name: 'Senin', sales: 400 },
    { name: 'Selasa', sales: 300 },
    { name: 'Rabu', sales: 500 },
    { name: 'Kamis', sales: 450 },
    { name: 'Jumat', sales: 600 }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm">Total Penjualan</h3>
          <p className="text-2xl font-bold text-blue-600">Rp 15.5M</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm">Laba Bersih</h3>
          <p className="text-2xl font-bold text-green-600">Rp 2.3M</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm">Total Anggota</h3>
          <p className="text-2xl font-bold text-purple-600">245</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm">Stok Barang</h3>
          <p className="text-2xl font-bold text-orange-600">1,234</p>
        </div>
      </div>

      {/* Charts */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">📈 Penjualan Mingguan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card cursor-pointer hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">🛍️ Manajemen Produk</h3>
          <p className="text-gray-600">Kelola stok dan harga barang</p>
        </div>
        <div className="card cursor-pointer hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">👥 Manajemen Kasir</h3>
          <p className="text-gray-600">Kelola data user kasir</p>
        </div>
        <div className="card cursor-pointer hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">📋 Laporan Keuangan</h3>
          <p className="text-gray-600">Lihat laporan L/R, Neraca, SHU</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
