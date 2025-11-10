'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleFavorite, addToCart } from '@/store/productSlice';

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const productId = parseInt(params.id as string);
  
  const { products, favorites, cart } = useSelector((state: RootState) => state.products);
  const product = products.find(p => p.id === productId);
  const isFavorite = favorites.includes(productId);
  
  const cartItem = cart.find(item => item.product.id === productId);
  const inCart = Boolean(cartItem);

  // SVG заглушка
  const placeholderSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231f2937'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%236b7280'%3E🖼️ Загрузка изображения...%3C/text%3E%3C/svg%3E";

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Продукт не найден</h1>
          <Link href="/products" className="text-blue-400 hover:text-blue-300">
            Вернуться к списку продуктов
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Навигация */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/products"
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
          >
            ← Назад к продуктам
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/cart"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              🛒 Корзина ({cart.reduce((total, item) => total + item.quantity, 0)})
            </Link>
          </div>
        </div>

        {/* Карточка продукта */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Изображение */}
            <div className="space-y-4">
              <img 
                src={product.thumbnail} 
                alt={product.title}
                className="w-full h-96 object-contain rounded-lg bg-gray-900"
                onError={(e) => {
                  e.currentTarget.src = placeholderSVG;
                }}
              />
            </div>
            
            {/* Информация */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-4xl font-bold text-white mb-4">{product.title}</h2>
                <button 
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition-all ${
                    isFavorite 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-400">${product.price}</span>
                  <span className="text-red-400 bg-red-900/30 px-3 py-1 rounded-full font-semibold">
                    Скидка {product.discountPercentage}%
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Бренд:</span>
                      <span className="text-white font-semibold">{product.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Категория:</span>
                      <span className="text-white font-semibold">{product.category}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Рейтинг:</span>
                      <span className="text-yellow-400 font-semibold flex items-center">
                        ⭐ {product.rating}/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">В наличии:</span>
                      <span className="text-white font-semibold">{product.stock} шт.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-colors ${
                    inCart
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {inCart ? '✅ В корзине' : '🛒 Добавить в корзину'}
                </button>
              </div>

              {inCart && (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                  <p className="text-green-400 text-center">
                    ✅ Товар в корзине ({cartItem?.quantity} шт.)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}