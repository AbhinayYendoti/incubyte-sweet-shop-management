import { useState } from 'react';
import { Sweet } from '@/types';
import { formatPrice } from '@/lib/currency';
import { DEFAULT_SWEET_IMAGE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSweets } from '@/contexts/SweetsContext';

interface SweetCardProps {
  sweet: Sweet;
}

const SweetCard = ({ sweet }: SweetCardProps) => {
  const { purchaseSweet } = useSweets();
  const [purchasing, setPurchasing] = useState(false);
  // Backend doesn't track quantity - only disable purchase if explicitly set to 0
  // undefined/null quantity means available (allow purchase)
  const isOutOfStock = sweet.quantity !== undefined && sweet.quantity === 0;

  const handlePurchase = async () => {
    if (isOutOfStock || purchasing) return;

    setPurchasing(true);
    const result = await purchaseSweet(sweet.id, 1);
    
    if (result.success) {
      toast({
        title: "🎉 Purchase Successful!",
        description: `${sweet.name} has been added to your order.`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error || "Sorry, this item could not be purchased.",
        variant: "destructive"
      });
    }
    setPurchasing(false);
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={sweet.image || DEFAULT_SWEET_IMAGE}
          alt={sweet.name || 'Sweet item'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {sweet.quantity !== undefined && (
          <Badge 
            className={`absolute top-3 right-3 ${
              isOutOfStock 
                ? 'bg-destructive text-destructive-foreground' 
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} left`}
          </Badge>
        )}
        {sweet.origin && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-primary-foreground bg-foreground/70 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <MapPin className="w-3 h-3" />
            {sweet.origin}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
            {sweet.name}
          </h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            {formatPrice(sweet.price)}
          </span>
        </div>
        {sweet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sweet.description}
          </p>
        )}
        <Badge variant="secondary" className="mt-3 capitalize">
          {sweet.category || 'Uncategorized'}
        </Badge>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          disabled={isOutOfStock || purchasing}
          onClick={handlePurchase}
        >
          {purchasing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Purchase'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SweetCard;
