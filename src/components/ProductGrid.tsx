import React, { useState } from 'react';
import { Product, Category } from '../types/marketplace';
import { ProductCard } from './ProductCard';
import { Badge } from './ui/badge';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  searchTerm: string;
}

const CATEGORIES: Category[] = ['All', 'Electronics', 'Fashion', 'Home', 'Other'];

export function ProductGrid({ products, onProductClick, searchTerm }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground mr-2">Categories:</span>
        {CATEGORIES.map(category => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-1.5 text-sm transition-colors"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={onProductClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl">
          <h3 className="text-xl font-medium">No items found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or category filters</p>
        </div>
      )}
    </div>
  );
}
