import { useState, useEffect } from 'react';
import { Sweet } from '@/types';
import { DEFAULT_SWEET_IMAGE, DEFAULT_CATEGORY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { categories } from '@/lib/categories';

interface AdminSweetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet?: Sweet | null;
  onSubmit: (data: Omit<Sweet, 'id'>) => void;
}

const AdminSweetForm = ({ open, onOpenChange, sweet, onSubmit }: AdminSweetFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: 'mithai',
    image: '',
    origin: ''
  });

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name || '',
        description: sweet.description || '',
        price: sweet.price?.toString() || '',
        quantity: sweet.quantity?.toString() || '',
        category: sweet.category || DEFAULT_CATEGORY,
        image: sweet.image || DEFAULT_SWEET_IMAGE,
        origin: sweet.origin || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: DEFAULT_CATEGORY,
        image: DEFAULT_SWEET_IMAGE,
        origin: ''
      });
    }
  }, [sweet, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description || undefined, // Empty string becomes undefined
      price: Number(formData.price),
      quantity: formData.quantity ? Number(formData.quantity) : undefined, // Empty string becomes undefined
      category: formData.category || DEFAULT_CATEGORY,
      image: formData.image || DEFAULT_SWEET_IMAGE,
      origin: formData.origin || undefined
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {sweet ? 'Edit Sweet' : 'Add New Sweet'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Gulab Jamun"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin (Optional)</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                placeholder="Rajasthan"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the sweet..."
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="450"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {sweet ? 'Update Sweet' : 'Add Sweet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSweetForm;
