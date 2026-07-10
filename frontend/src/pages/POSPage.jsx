import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productAPI, transactionAPI } from '../api/endpoints';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiX } from 'react-icons/fi';

function POSPage() {
  const [cart, setCart] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { data: products } = useQuery(['products'], () => productAPI.getAll().then(r => r.data.data));

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.priceRetail }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, subtotal: product.priceRetail }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = (subtotal - discount) * 0.1;
    return { subtotal, discount, tax, total: subtotal - discount + tax };
  };

  const handleScan = async () => {
    if (!barcode) return;
    try {
      const response = await productAPI.getByBarcode(barcode);
      addToCart(response.data.data);
      setBarcode('');
      toast.success('Produk ditambahkan');
    } catch (error) {
      toast.error('Produk tidak ditemukan');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    try {
      const { subtotal, total } = calculateTotal();
      const payload = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.priceRetail,
          subtotal: item.subtotal
        })),
        discount,
        paymentMethod: 'cash',
        paymentStatus: 'completed'
      };
      
      await transactionAPI.create(payload);
      toast.success('Transaksi berhasil!');
      setCart([]);
      setDiscount(0);
    } catch (error) {
      toast.error('Transaksi gagal');
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="grid grid-cols-3 gap-6 p-6 h-screen bg-gray-100">
      {/* Produk */}
      <div className="col-span-2">
        <div className="card mb-4">
          <h2 className="text-xl font-bold mb-4">Scan Barcode atau Pilih Produk</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Scan barcode..."
              className="input-field flex-1"
              autoFocus
            />
            <button onClick={handleScan} className="btn-primary">Scan</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products?.map(product => (
            <div key={product.id} className="card cursor-pointer hover:shadow-lg transition" onClick={() => addToCart(product)}>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.sku}</p>
              <p className="text-lg font-bold text-blue-600">Rp {product.priceRetail.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-500">Stok: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keranjang */}
      <div className="card flex flex-col">
        <h2 className="text-xl font-bold mb-4">🛒 Keranjang</h2>
        
        <div className="flex-1 overflow-y-auto mb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-100 rounded mb-2">
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-600">{item.quantity}x Rp {item.priceRetail.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
                <FiX />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Diskon:</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="input-field w-24 h-8"
            />
          </div>
          <div className="flex justify-between">
            <span>Pajak (10%):</span>
            <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total:</span>
            <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button onClick={handleCheckout} className="btn-primary w-full mt-4 text-lg font-bold">
          💳 Bayar
        </button>
      </div>
    </div>
  );
}

export default POSPage;
