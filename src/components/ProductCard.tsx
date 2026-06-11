import React from 'react';
import { Product } from '../types/marketplace';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80'} 
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/80">
          {product.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
          {product.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <MapPin className="h-3 w-3 mr-1" />
          {product.location}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold">KSh {product.price.toLocaleString()}</span>
        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
