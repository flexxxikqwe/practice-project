import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  thumbnail: string;
  rating: number;
  discountPercentage: number;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductsState {
  products: Product[];
  favorites: number[];
  cart: CartItem[];
  filters: {
    category: string;
    priceRange: [number, number];
    brands: string[];
    rating: number;
    inStock: boolean;
  };
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  editingProduct: Product | null;
}

// SVG заглушки
const placeholderSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231f2937'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3E📷 Загрузка изображения...%3C/text%3E%3C/svg%3E";

const initialState: ProductsState = {
  products: [
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
    {
      id: 2,
      title: "Samsung Galaxy S24",
      description: "Флагманский смартфон с искусственным интеллектом. Инновационные функции и стильный дизайн.", 
      price: 849,
      brand: "Samsung",
      thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
      rating: 4.6,
      discountPercentage: 5,
      category: "Смартфоны",
      stock: 75
    },
    {
      id: 3,
      title: "MacBook Air M3",
      description: "Легкий и мощный ноутбук с чипом Apple M3. Идеален для работы и творчества.",
      price: 1299,
      brand: "Apple",
      thumbnail: "https://i.dummyjson.com/data/products/6/thumbnail.png",
      rating: 4.9,
      discountPercentage: 15,
      category: "Ноутбуки",
      stock: 30
    },
    {
      id: 4,
      title: "Sony WH-1000XM5", 
      description: "Наушники с шумоподавлением и премиальным звуком. Погрузитесь в мир музыки.",
      price: 399,
      brand: "Sony",
      thumbnail: "https://i.dummyjson.com/data/products/7/thumbnail.jpg",
      rating: 4.7,
      discountPercentage: 8,
      category: "Аудио",
      stock: 100
    },
    {
      id: 5,
      title: "iPad Pro M2",
      description: "Мощный планшет для профессионалов. Творчество без границ.",
      price: 1099,
      brand: "Apple",
      thumbnail: "https://i.dummyjson.com/data/products/8/thumbnail.jpg",
      rating: 4.8,
      discountPercentage: 12,
      category: "Планшеты",
      stock: 40
    },
    {
      id: 6,
      title: "Samsung Galaxy Watch",
      description: "Умные часы с продвинутым отслеживанием здоровья и фитнеса.",
      price: 299,
      brand: "Samsung",
      thumbnail: "https://i.dummyjson.com/data/products/10/thumbnail.jpeg",
      rating: 4.5,
      discountPercentage: 7,
      category: "Гаджеты",
      stock: 60
    },
    {
      id: 7,
      title: "Google Pixel 8",
      description: "Смартфон с лучшей камерой и чистым Android.",
      price: 799,
      brand: "Google",
      thumbnail: "https://i.dummyjson.com/data/products/11/thumbnail.jpg",
      rating: 4.4,
      discountPercentage: 8,
      category: "Смартфоны",
      stock: 25
    },
    {
      id: 8,
      title: "Dell XPS 13",
      description: "Ультрабук с безрамочным дисплеем и мощной производительностью.",
      price: 1199,
      brand: "Dell",
      thumbnail: "https://i.dummyjson.com/data/products/12/thumbnail.jpg",
      rating: 4.6,
      discountPercentage: 10,
      category: "Ноутбуки",
      stock: 20
    },
    {
      id: 9,
      title: "Bose QuietComfort 45",
      description: "Наушники с активным шумоподавлением и премиальным звуком.",
      price: 329,
      brand: "Bose",
      thumbnail: "https://i.dummyjson.com/data/products/13/thumbnail.jpg",
      rating: 4.5,
      discountPercentage: 6,
      category: "Аудио",
      stock: 80
    },
    {
      id: 10,
      title: "Microsoft Surface Pro",
      description: "Универсальный планшет-трансформер для работы и творчества.",
      price: 999,
      brand: "Microsoft",
      thumbnail: "https://i.dummyjson.com/data/products/14/thumbnail.jpg",
      rating: 4.3,
      discountPercentage: 9,
      category: "Планшеты",
      stock: 35
    },
    {
      id: 11,
      title: "Apple Watch Series 9",
      description: "Умные часы с продвинутым отслеживанием здоровья.",
      price: 399,
      brand: "Apple",
      thumbnail: "https://i.dummyjson.com/data/products/15/thumbnail.jpg",
      rating: 4.7,
      discountPercentage: 5,
      category: "Гаджеты",
      stock: 45
    },
    {
      id: 12,
      title: "Sony PlayStation 5",
      description: "Игровая консоль нового поколения с 4K графикой.",
      price: 499,
      brand: "Sony",
      thumbnail: "https://i.dummyjson.com/data/products/16/thumbnail.jpg",
      rating: 4.9,
      discountPercentage: 3,
      category: "Гейминг",
      stock: 15
    }
  ],
  favorites: [],
  cart: [],
  filters: {
    category: 'all',
    priceRange: [0, 2000],
    brands: [],
    rating: 0,
    inStock: false
  },
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 8,
  editingProduct: null
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const index = state.favorites.indexOf(productId);
      if (index === -1) {
        state.favorites.push(productId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    updateCartQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.cart.find(item => item.product.id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter(cartItem => cartItem.product.id !== action.payload.productId);
        }
      }
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.currentPage = 1;
    },
    setPriceFilter: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
      state.currentPage = 1;
    },
    setBrandsFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.brands = action.payload;
      state.currentPage = 1;
    },
    setRatingFilter: (state, action: PayloadAction<number>) => {
      state.filters.rating = action.payload;
      state.currentPage = 1;
    },
    setInStockFilter: (state, action: PayloadAction<boolean>) => {
      state.filters.inStock = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        priceRange: [0, 2000],
        brands: [],
        rating: 0,
        inStock: false
      };
      state.searchTerm = '';
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
      const newProduct: Product = {
        id: Math.max(...state.products.map(p => p.id)) + 1,
        ...action.payload
      };
      state.products.unshift(newProduct);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(product => product.id !== action.payload);
      state.favorites = state.favorites.filter(id => id !== action.payload);
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    setEditingProduct: (state, action: PayloadAction<Product | null>) => {
      state.editingProduct = action.payload;
    }
  },
});

export const { 
  toggleFavorite, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity,
  setCategoryFilter,
  setPriceFilter,
  setBrandsFilter,
  setRatingFilter,
  setInStockFilter,
  setSearchTerm,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  addProduct,
  updateProduct,
  deleteProduct,
  setEditingProduct
} = productSlice.actions;
export default productSlice.reducer;