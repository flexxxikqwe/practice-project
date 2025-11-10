import { notFound } from 'next/navigation';
import Link from 'next/link';

// Статические параметры для всех продуктов
export async function generateStaticParams() {
  return [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
    { id: '7' }, { id: '8' }, { id: '9' }, { id: '10' }, { id: '11' }, { id: '12' }
  ];
}

// Mock данные
const mockProducts = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    description: "Новый iPhone с продвинутой камерой и процессором A17 Pro. Идеальный выбор для профессионалов.",
    price: 999,
    brand: "Apple",
    thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    rating: 4.8,
    discountPercentage: 10,
    category: "Смартфоны",
    stock: 50
  },
  // ... остальные продукты такие же как были
];

interface PageProps {
  params: { id: string };
}

// Серверный компонент без Redux
export default function ProductDetailPage({ params }: PageProps) {
  const productId = parseInt(params.id);
  const product = mockProducts.find(p => p.id === productId);

  const placeholderSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231f2937'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%236b7280'%3E🖼️ Загрузка изображения...%3C/text%3E%3C/svg%3E";

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/products"
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
          >
            ← Назад к продуктам
          </Link>
          <Link 
            href="/cart"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            🛒 Корзина
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
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
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-4">{product.title}</h2>
              
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
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1">
                  🛒 Добавить в корзину
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  ❤️
                </button>
              </div>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <p className="text-blue-400 text-center text-sm">
                  💡 Для работы корзины и избранного перейдите на главную страницу продуктов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}