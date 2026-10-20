import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  products as initialProducts, 
  categories as initialCategories, 
  getFeaturedProducts, 
  getNewArrivals, 
  getBestSellers 
} from '../data/mockData.js';
import { productService } from '../api/productService.js';

const ProductContext = createContext(undefined);

export function ProductProvider({ children }) {
  const [productList, setProductList] = useState(initialProducts);
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBackendData = async () => {
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        productService.getAll({ limit: 50 }),
        productService.getCategories(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value?.products?.length > 0) {
        setProductList(prodRes.value.products);
      }
      if (catRes.status === 'fulfilled' && catRes.value?.length > 0) {
        setCategoryList(catRes.value);
      }
    } catch {
      // Graceful fallback to initial mock data if MongoDB is offline
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const featured = productList.filter(p => p.isActive && (p.isFeatured || p.tags?.includes('top-picks'))).slice(0, 8);
  const newArr = [...productList].filter(p => p.isActive).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const best = [...productList].filter(p => p.isActive).sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 8);

  return (
    <ProductContext.Provider value={{
      products: productList,
      categories: categoryList,
      featuredProducts: featured.length > 0 ? featured : getFeaturedProducts(8),
      newArrivals: newArr.length > 0 ? newArr : getNewArrivals(8),
      bestSellers: best.length > 0 ? best : getBestSellers(8),
      isLoading,
      getProductById: (id) => productList.find(p => p.id === id),
      getProductsByCategory: (category) => 
        productList.filter(p => p.category.toLowerCase() === category.toLowerCase() && p.isActive),
      searchProducts: (query) => {
        const q = (query || '').toLowerCase();
        return productList.filter(p => 
          p.isActive && (
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.fabric && p.fabric.toLowerCase().includes(q)) ||
            p.tags?.some(tag => tag.toLowerCase().includes(q))
          )
        );
      },
      refreshProducts: fetchBackendData,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
