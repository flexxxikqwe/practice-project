'use client';

import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { 
  toggleFavorite, 
  setCategoryFilter, 
  setPriceFilter, 
  setBrandsFilter,
  setRatingFilter,
  setInStockFilter,
  setSearchTerm,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  deleteProduct,
  setEditingProduct
} from '@/store/productSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { 
    products, 
    favorites, 
    filters, 
    searchTerm, 
    currentPage, 
    itemsPerPage 
  } = useSelector((state: RootState) => state.products);
  
  const [localFilter, setLocalFilter] = useState<'all' | 'favorites'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // SVG заглушка
  const placeholderSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231f2937'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3E📷 Загрузка изображения...%3C/text%3E%3C/svg%3E";

  // Уникальные категории и бренды для фильтров
 const getUniqueCategories = () => {
  const categoriesSet = new Set<string>();
  products.forEach(p => categoriesSet.add(p.category));
  return ['all', ...Array.from(categoriesSet)];
};

const getUniqueBrands = () => {
  const brandsSet = new Set<string>();
  products.forEach(p => brandsSet.add(p.brand));
  return Array.from(brandsSet);
};

const categories = getUniqueCategories();
const brands = getUniqueBrands();
const maxPrice = Math.max(...products.map(p => p.price));

  // Фильтрация продуктов
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Фильтр по избранному
      if (localFilter === 'favorites' && !favorites.includes(product.id)) {
        return false;
      }
      
      // Фильтр по категории
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      
      // Фильтр по цене
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Фильтр по брендам
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      
      // Фильтр по рейтингу
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }
      
      // Фильтр по наличию
      if (filters.inStock && product.stock === 0) {
        return false;
      }
      
      // Поиск
      if (searchTerm && 
          !product.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.brand.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [products, favorites, localFilter, filters, searchTerm]);

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const toggleFavoriteHandler = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    dispatch(toggleFavorite(id));
  };

  const handleCardClick = (id: number) => {
    router.push(`/products/${id}`);
  };

  const handleEditProduct = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    dispatch(setEditingProduct(product));
    router.push('/create-product');
  };

  const handleDeleteProduct = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    dispatch(setBrandsFilter(newBrands));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    dispatch(setItemsPerPage(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🛍️ Наши продукты
          </h1>
          <p className="text-gray-300 text-lg">
            Откройте для себя лучшие технологические новинки
          </p>
        </div>

        {/* Панель управления */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Основные кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setLocalFilter('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  localFilter === 'all' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📦 Все продукты ({products.length})
              </button>
              <button
                onClick={() => setLocalFilter('favorites')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  localFilter === 'favorites' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ❤️ Избранное ({favorites.length})
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔧 Фильтры {showFilters ? '▲' : '▼'}
            </button>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/create-product"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md whitespace-nowrap"
              onClick={() => dispatch(setEditingProduct(null))}
            >
              ➕ Создать продукт
            </Link>
            <Link 
              href="/cart"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md whitespace-nowrap"
            >
              🛒 Корзина
            </Link>
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск по названию, описанию или бренду..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Фильтры */}
        {showFilters && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Фильтр по категории */}
              <div>
                <label className="block text-gray-300 font-semibold mb-3">Категория</label>
                <select
                  value={filters.category}
                  onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Все категории' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Фильтр по цене */}
              <div>
                <label className="block text-gray-300 font-semibold mb-3">
                  Цена: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={filters.priceRange[1]}
                    onChange={(e) => dispatch(setPriceFilter([filters.priceRange[0], parseInt(e.target.value)]))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>$0</span>
                    <span>${maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Фильтр по рейтингу */}
              <div>
                <label className="block text-gray-300 font-semibold mb-3">
                  Рейтинг: {filters.rating > 0 ? `${filters.rating}+ ⭐` : 'Любой'}
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => dispatch(setRatingFilter(Number(e.target.value)))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value={0}>Любой рейтинг</option>
                  <option value={4}>4+ ⭐</option>
                  <option value={4.5}>4.5+ ⭐</option>
                  <option value={4.7}>4.7+ ⭐</option>
                </select>
              </div>

              {/* Фильтр по наличию */}
              <div>
                <label className="block text-gray-300 font-semibold mb-3">Наличие</label>
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => dispatch(setInStockFilter(e.target.checked))}
                    className="rounded border-gray-600"
                  />
                  <span>Только в наличии</span>
                </label>
              </div>
            </div>

            {/* Фильтр по брендам */}
            <div className="mt-6">
              <label className="block text-gray-300 font-semibold mb-3">Бренды</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded border-gray-600"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => dispatch(clearFilters())}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                🗑️ Сбросить фильтры
              </button>
              <div className="flex items-center gap-2 text-gray-300">
                <span>Товаров на странице:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{filteredProducts.length}</div>
              <div className="text-gray-400 text-sm">Найдено товаров</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{favorites.length}</div>
              <div className="text-gray-400 text-sm">В избранном</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {categories.length - 1}
              </div>
              <div className="text-gray-400 text-sm">Категорий</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{brands.length}</div>
              <div className="text-gray-400 text-sm">Брендов</div>
            </div>
          </div>
        </div>

        {/* Сетка продуктов */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-white mb-2">Товары не найдены</h3>
            <p className="text-gray-400 mb-4">Попробуйте изменить параметры поиска или фильтры</p>
            <button
              onClick={() => dispatch(clearFilters())}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map(product => {
                const isFavorite = favorites.includes(product.id);
                
                return (
                  <div 
                    key={product.id} 
                    onClick={() => handleCardClick(product.id)}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    {/* Картинка */}
                    <div className="relative">
                      <img 
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = placeholderSVG;
                        }}
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button 
                          onClick={(e) => toggleFavoriteHandler(e, product.id)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                            isFavorite 
                              ? 'bg-red-500 text-white animate-pulse' 
                              : 'bg-gray-900/80 text-gray-400 hover:text-white'
                          }`}
                        >
                          {isFavorite ? '❤️' : '🤍'}
                        </button>
                        <button 
                          onClick={(e) => handleEditProduct(e, product)}
                          className="p-2 bg-gray-900/80 backdrop-blur-sm text-gray-400 rounded-full hover:text-blue-400 transition-all"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => handleDeleteProduct(e, product.id)}
                          className="p-2 bg-gray-900/80 backdrop-blur-sm text-gray-400 rounded-full hover:text-red-400 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                      {product.stock === 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Нет в наличии
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Контент */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-white line-clamp-2 flex-1">
                          {product.title}
                        </h3>
                        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded ml-2 whitespace-nowrap">
                          {product.brand}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-green-400">
                            ${product.price}
                          </span>
                          <div className="flex items-center text-yellow-400">
                            <span>⭐</span>
                            <span className="ml-1 font-semibold">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Категория: {product.category}</span>
                        <span>В наличии: {product.stock} шт.</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  ←
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}

        {/* Статус */}
        <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-gray-300 text-lg">
            🎯 Показано: <strong className="text-white">{paginatedProducts.length}</strong> из{' '}
            <strong className="text-white">{filteredProducts.length}</strong> продуктов • 
            Страница: <strong className="text-white">{currentPage}</strong> из{' '}
            <strong className="text-white">{totalPages}</strong> • 
            Фильтр: <strong className="text-white">{localFilter === 'all' ? 'Все' : 'Избранные'}</strong>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            💡 Нажмите на карточку для просмотра деталей товара • ✏️ Редактировать • 🗑️ Удалить
          </p>
        </div>
      </div>
    </div>
  );
}