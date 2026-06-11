import React, { useState } from 'react';
import { Product, CONTACT_NUMBER, CONTACT_NUMBER_INT } from '../types/marketplace';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, ShoppingCart, Share2, Heart, MapPin, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetails({ product, onBack, onAddToCart }: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(0);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi, I'm interested in "${product.title}" listed for KSh ${product.price.toLocaleString()}.`);
    window.open(`https://wa.me/${CONTACT_NUMBER_INT.replace('+', '')}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-8 hover:bg-transparent px-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to browse
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
            <img 
              src={product.images?.[activeImage] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80'} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    activeImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {product.location}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">KSh {product.price.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Description</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-6 border-t space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="flex-1 h-14 text-lg" onClick={() => onAddToCart(product)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary" className="flex-1 h-14 text-lg" onClick={handleWhatsApp}>
                <MessageSquare className="mr-2 h-5 w-5" />
                Text to Buy
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Heart className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-xl space-y-2 border">
              <p className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Direct Contact: {CONTACT_NUMBER}
              </p>
              <p className="text-xs text-muted-foreground">Contact the seller directly via text or WhatsApp to arrange payment and delivery.</p>
            </div>
            
            <p className="text-xs text-center text-muted-foreground pt-4">
              Member since {new Date(product.createdAt).getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
