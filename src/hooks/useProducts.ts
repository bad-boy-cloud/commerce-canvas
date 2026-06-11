import { useState, useEffect } from 'react';
import { Product } from '../types/marketplace';

const STORAGE_KEY = 'marketplace_products';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Modern Stylish Sneakers',
    description: 'Comfortable and stylish sneakers for everyday wear. Made with high-quality materials and designed for durability.',
    price: 12500,
    category: 'Fashion',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/13b58e12-814f-4400-b691-12d7d9f5962f/modern-sneakers-a891c350-1781206834815.webp'],
    location: 'Nairobi',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Vintage 35mm Camera',
    description: 'A classic 35mm film camera for photography enthusiasts. Perfect for capturing timeless moments with a retro feel.',
    price: 18000,
    category: 'Electronics',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/13b58e12-814f-4400-b691-12d7d9f5962f/vintage-camera-1725f45d-1781206834758.webp'],
    location: 'Mombasa',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Minimalist Desk Lamp',
    description: 'Sleek black metal finish lamp with a warm glow. Ideal for your modern home office or bedside table.',
    price: 6500,
    category: 'Home',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/13b58e12-814f-4400-b691-12d7d9f5962f/minimalist-desk-lamp-4246b4ef-1781206835198.webp'],
    location: 'Kisumu',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with these premium over-ear wireless headphones. Noise-canceling technology included.',
    price: 28000,
    category: 'Electronics',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/13b58e12-814f-4400-b691-12d7d9f5962f/premium-headphones-c912e71e-1781206835059.webp'],
    location: 'Nairobi',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Smart Watch Series X',
    description: 'The latest smart watch with fitness tracking, notifications, and a sleek metal band for a modern look.',
    price: 35000,
    category: 'Electronics',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/13b58e12-814f-4400-b691-12d7d9f5962f/smart-watch-8bc284d1-1781206835057.webp'],
    location: 'Thika',
    createdAt: new Date().toISOString(),
  }
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
    setIsLoaded(true);
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newProduct;
  };

  const getProduct = (id: string) => {
    return products.find(p => p.id === id);
  };

  return { products, addProduct, getProduct, isLoaded };
}
