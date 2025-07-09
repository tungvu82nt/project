import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { localStorageService } from '../services/LocalStorageService';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart data from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorageService.getItem('cart');
    if (savedCart && Array.isArray(savedCart)) {
      setItems(savedCart);
    }
  }, []);

  // Save cart data to localStorage whenever items change
  useEffect(() => {
    localStorageService.setItem('cart', items);
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.product.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        selectedColor,
        selectedSize
      }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount
  };
};