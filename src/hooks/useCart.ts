import { useState, useEffect } from 'react';
import { Product, CartItem, KAMAKIS_DELIVERY_DISTANCES, DELIVERY_BASE_FEE, DELIVERY_PER_KM_FEE, LocationCoords, KAMAKIS_COORDS } from '../types/marketplace';
import { toast } from 'sonner';

const CART_STORAGE_KEY = 'marketplace_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryArea, setDeliveryArea] = useState<string>('');
  const [exactLocation, setExactLocation] = useState<LocationCoords | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  useEffect(() => {
    if (exactLocation) {
      // Calculate distance using Haversine formula
      const R = 6371; // Radius of the earth in km
      const dLat = (exactLocation.lat - KAMAKIS_COORDS.lat) * Math.PI / 180;
      const dLon = (exactLocation.lng - KAMAKIS_COORDS.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(KAMAKIS_COORDS.lat * Math.PI / 180) * Math.cos(exactLocation.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      setDeliveryFee(Math.round(DELIVERY_BASE_FEE + (distance * DELIVERY_PER_KM_FEE)));
    } else if (deliveryArea) {
      const area = KAMAKIS_DELIVERY_DISTANCES.find(a => a.name === deliveryArea);
      if (area) {
        setDeliveryFee(DELIVERY_BASE_FEE + (area.distance * DELIVERY_PER_KM_FEE));
      }
    } else {
      setDeliveryFee(0);
    }
  }, [deliveryArea, exactLocation]);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  };

  const addToCart = (product: Product) => {
    const existingIndex = items.findIndex(item => item.product.id === product.id);
    let newItems: CartItem[];
    
    if (existingIndex > -1) {
      newItems = [...items];
      newItems[existingIndex].quantity += 1;
    } else {
      newItems = [...items, { product, quantity: 1 }];
    }
    
    saveCart(newItems);
    toast.success(`${product.title} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    const newItems = items.filter(item => item.product.id !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newItems = items.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    deliveryFee,
    deliveryArea,
    setDeliveryArea,
    exactLocation,
    setExactLocation,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
}
