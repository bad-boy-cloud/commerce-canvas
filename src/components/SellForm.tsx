import React, { useState } from 'react';
import { Category, KENYA_CITIES } from '../types/marketplace';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

interface SellFormProps {
  onSubmit: (product: {
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    images: string[];
  }) => void;
}

const CATEGORIES: Exclude<Category, 'All'>[] = ['Electronics', 'Fashion', 'Home', 'Other'];

export function SellForm({ onSubmit }: SellFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Other',
    location: 'Nairobi',
  });

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length ? newUrls : ['']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validImages = imageUrls.filter(url => url.trim() !== '');
    
    if (!formData.title || !formData.description || !formData.price || validImages.length === 0 || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    onSubmit({
      ...formData,
      price,
      images: validImages,
    });
    
    toast.success('Item listed successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">List an item for sale</CardTitle>
          <CardDescription>
            Enter the details of the item you want to sell.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input
                id="title"
                placeholder="e.g. Modern Leather Sofa"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (KSh)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location in Kenya</Label>
              <Select 
                value={formData.location} 
                onValueChange={(val) => setFormData({ ...formData, location: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {KENYA_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Image URLs</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                  <Plus className="h-4 w-4 mr-1" /> Add Image
                </Button>
              </div>
              <div className="space-y-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="https://example.com/image.jpg"
                        className="pl-10"
                        value={url}
                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      />
                    </div>
                    {imageUrls.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImageUrl(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                For now, please provide a direct link to an image.
              </p>
            </div>

            <Button type="submit" className="w-full h-12 text-lg">
              List Item
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
