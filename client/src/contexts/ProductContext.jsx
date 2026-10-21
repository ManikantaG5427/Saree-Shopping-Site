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
const CUSTOM_PRODUCTS_KEY = 'slsh_custom_products';

export function ProductProvider({ children }) {
  const [productList, setProductList] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map(p => p.id));
          return [...parsed, ...initialProducts.filter(p => !ids.has(p.id))];
        }
      }
    } catch {
      // fallback
    }
    return initialProducts;
  });

  const [categoryList, setCategoryList] = useState(initialCategories);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBackendData = async () => {
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        productService.getAll({ limit: 50 }),
        productService.getCategories(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value?.products?.length > 0) {
        setProductList(prev => {
          try {
            const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
            const custom = saved ? JSON.parse(saved) : [];
            const customIds = new Set(custom.map(p => p.id));
            return [...custom, ...prodRes.value.products.filter(p => !customIds.has(p.id))];
          } catch {
            return prodRes.value.products;
          }
        });
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

  const addProduct = (newProduct) => {
    const id = newProduct.id || `custom-saree-${Date.now()}`;
    const productWithId = {
      ...newProduct,
      id,
      images: Array.isArray(newProduct.images) && newProduct.images.length > 0 
        ? newProduct.images 
        : [newProduct.image || '/images/meher_crimson_saree.jpg'],
      rating: 5,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setProductList((prev) => {
      const updated = [productWithId, ...prev];
      try {
        const custom = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]');
        localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify([productWithId, ...custom]));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      productService.create?.(productWithId).catch(() => {});
    } catch {
      // ignore
    }
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProductList((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      try {
        const custom = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]');
        const updatedCustom = custom.map(p => p.id === id ? { ...p, ...updatedFields } : p);
        localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updatedCustom));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      productService.update?.(id, updatedFields).catch(() => {});
    } catch {
      // ignore
    }
  };

  const deleteProduct = (id) => {
    setProductList((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        const custom = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]');
        localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(custom.filter(p => p.id !== id)));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      productService.delete?.(id).catch(() => {});
    } catch {
      // ignore
    }
  };

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
      addProduct,
      updateProduct,
      deleteProduct,
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
