'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, updateCartQuantity } from '@/store/productSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.products);

  const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">🛒 Корзина пуста</h1>
          <p className="text-gray-300 text-lg mb-8">Добавьте товары в корзину чтобы продолжить</p>
          <Link 
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            🏪 Перейти к покупкам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">🛒 Корзина</h1>
          <Link 
            href="/products"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            ← Вернуться к покупкам
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-4 py-4 border-b border-gray-700 last:border-b-0">
                <img 
                  src={item.product.thumbnail} 
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{item.product.title}</h3>
                  <p className="text-gray-400 text-sm">{item.product.brand}</p>
                  <p className="text-green-400 font-semibold">${item.product.price}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-red-400 hover:text-red-300 text-sm mt-1"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Товаров:</span>
              <span className="text-white font-semibold">{totalItems} шт.</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-300">Общая стоимость:</span>
              <span className="text-2xl font-bold text-green-400">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                💳 Оформить заказ
              </button>
              <button 
                onClick={() => cart.forEach(item => handleRemoveItem(item.product.id))}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🗑️ Очистить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}