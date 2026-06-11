import React from 'react';
import { Search, ShoppingBag, PlusCircle, Home, ShoppingCart, Trash2, MapPin, Map as MapIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { CartItem, CONTACT_NUMBER, MPESA_INSTRUCTIONS, KAMAKIS_DELIVERY_DISTANCES, LocationCoords } from '../types/marketplace';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LocationPicker } from './LocationPicker';

interface NavbarProps {
  onNavigate: (view: 'home' | 'sell') => void;
  onSearch: (term: string) => void;
  currentView: 'home' | 'sell';
  cartItems: CartItem[];
  cartSubtotal: number;
  cartTotal: number;
  deliveryFee: number;
  deliveryArea: string;
  onDeliveryAreaChange: (area: string) => void;
  exactLocation: LocationCoords | null;
  onExactLocationChange: (coords: LocationCoords) => void;
  onRemoveFromCart: (id: string) => void;
}

export function Navbar({ 
  onNavigate, 
  onSearch, 
  currentView, 
  cartItems, 
  cartSubtotal,
  cartTotal, 
  deliveryFee,
  deliveryArea,
  onDeliveryAreaChange,
  exactLocation,
  onExactLocationChange,
  onRemoveFromCart 
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="bg-primary p-2 rounded-lg text-primary-foreground">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Marketplace Kenya</span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items to buy..."
              className="pl-10 w-full bg-muted/50 focus:bg-background transition-colors"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant={currentView === 'home' ? 'secondary' : 'ghost'} 
            onClick={() => onNavigate('home')}
            className="hidden sm:flex"
          >
            <Home className="mr-2 h-4 w-4" />
            Browse
          </Button>
          <Button 
            onClick={() => onNavigate('sell')}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Sell Item
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-4">
                        <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                          <img src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80'} alt={item.product.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">{item.product.title}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-sm">KSh {(item.product.price * item.quantity).toLocaleString()}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onRemoveFromCart(item.product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="pt-6 space-y-4">
                  <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <MapPin className="h-4 w-4" />
                      <span>Delivery from Kamakis, Kiambu</span>
                    </div>
                    
                    {exactLocation ? (
                      <div className="flex flex-col gap-2">
                        <div className="bg-primary/5 p-2 rounded border border-primary/20 text-xs">
                          <span className="font-bold text-primary">GPS Location:</span> {exactLocation.name || `${exactLocation.lat.toFixed(4)}, ${exactLocation.lng.toFixed(4)}`}
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onExactLocationChange(null as any)}>
                          Clear GPS Location
                        </Button>
                      </div>
                    ) : (
                      <Select value={deliveryArea} onValueChange={onDeliveryAreaChange}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {KAMAKIS_DELIVERY_DISTANCES.map((area) => (
                            <SelectItem key={area.name} value={area.name}>
                              {area.name} ({area.distance} km)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full h-10">
                          <MapIcon className="mr-2 h-4 w-4" />
                          {exactLocation ? 'Change Exact Location' : 'Pick Exact Location on Map'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                        <div className="p-6">
                          <DialogHeader className="mb-4">
                            <DialogTitle>Select Delivery Location</DialogTitle>
                          </DialogHeader>
                          <LocationPicker 
                            initialCoords={exactLocation} 
                            onLocationSelect={onExactLocationChange} 
                            onClose={() => {}} 
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {deliveryFee > 0 && (
                      <p className="text-[10px] text-muted-foreground italic leading-tight">
                        Bolt-style GPS delivery fee calculated based on distance from Kamakis (Eastern Bypass).
                      </p>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>KSh {cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{deliveryFee > 0 ? `KSh ${deliveryFee.toLocaleString()}` : 'Select area'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-xl text-primary">KSh {cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Payment Instructions</p>
                    <p className="text-sm">{MPESA_INSTRUCTIONS}</p>
                  </div>
                  <Button className="w-full h-12 text-lg font-bold" onClick={() => window.open(`tel:${CONTACT_NUMBER}`, '_self')}>
                    Pay Later via M-Pesa
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
