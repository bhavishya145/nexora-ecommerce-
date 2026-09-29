import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const addToCompare = (product: Product) => {
    if (compareProducts.some(p => p.id === product.id)) {
      showToast('Product already in comparison', 'info');
      return;
    }
    if (compareProducts.length >= 4) {
      showToast('You can compare a maximum of 4 products at once', 'warning');
      return;
    }
    setCompareProducts(prev => [...prev, product]);
    showToast(`Added "${product.name}" to comparison`, 'success');
    setIsCompareOpen(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const isInCompare = (productId: string) => compareProducts.some(p => p.id === productId);

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        setIsCompareOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
