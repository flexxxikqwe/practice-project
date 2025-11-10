import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          🛍️ Ecosystem Alpha
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Практика Frontend разработки на React/Next.js с Redux. 
          Полнофункциональное SPA с каталогом продуктов, корзиной, избранным и фильтрацией.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Каталог продуктов</h3>
            <p className="text-gray-400 text-sm">Фильтрация, поиск, пагинация</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Корзина покупок</h3>
            <p className="text-gray-400 text-sm">Добавление, удаление, изменение количества</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Избранное</h3>
            <p className="text-gray-400 text-sm">Лайки, персональные подборки</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
          >
            🚀 Начать покупки
          </Link>
          <Link 
            href="/create-product"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
          >
            ➕ Создать продукт
          </Link>
        </div>

        <div className="mt-12 text-gray-500">
          <p>Технологии: Next.js 16, React 19, Redux Toolkit, TypeScript, Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}