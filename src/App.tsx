import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductGrid } from './components/ProductGrid';
import { SellForm } from './components/SellForm';
import { ProductDetails } from './components/ProductDetails';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { Product } from './types/marketplace';
import { Toaster } from './components/ui/sonner';

function App() {
  const { products, addProduct } = useProducts();
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    subtotal,
    total, 
    deliveryFee, 
    deliveryArea, 
    setDeliveryArea,
    exactLocation,
    setExactLocation
  } = useCart();

  const [view, setView] = useState<'home' | 'sell' | 'details'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (newView: 'home' | 'sell') => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('details');
    window.scrollTo(0, 0);
  };

  const handleSellSubmit = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    addProduct(productData);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Navbar 
        onNavigate={handleNavigate} 
        onSearch={setSearchTerm}
        currentView={view === 'sell' ? 'sell' : 'home'}
        cartItems={items}
        cartSubtotal={subtotal}
        cartTotal={total}
        deliveryFee={deliveryFee}
        deliveryArea={deliveryArea}
        onDeliveryAreaChange={setDeliveryArea}
        exactLocation={exactLocation}
        onExactLocationChange={setExactLocation}
        onRemoveFromCart={removeFromCart}
      />
      
      <main className="container mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Marketplace Kenya</h1>
              <p className="text-xl text-muted-foreground">Buy and sell anything across Nairobi, Mombasa, and beyond.</p>
            </div>
            <ProductGrid 
              products={products} 
              onProductClick={handleProductClick} 
              searchTerm={searchTerm}
            />
          </div>
        )}

        {view === 'sell' && (
          <SellForm onSubmit={handleSellSubmit} />
        )}

        {view === 'details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct} 
            onAddToCart={addToCart}
            onBack={() => setView('home')} 
          />
        )}
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
