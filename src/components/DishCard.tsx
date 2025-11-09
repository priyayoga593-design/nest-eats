import { Plus, Leaf, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DishCardProps {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: boolean;
    is_vegetarian: boolean;
    spice_level: number;
    calories: number;
  };
  onAddToCart: () => void;
}

const DishCard = ({ dish, onAddToCart }: DishCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-hover transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={dish.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {dish.is_vegetarian && (
            <Badge variant="secondary" className="bg-secondary/90 backdrop-blur">
              <Leaf className="h-3 w-3 mr-1" />
              Veg
            </Badge>
          )}
          {dish.spice_level > 0 && (
            <Badge variant="secondary" className="bg-destructive/90 backdrop-blur text-white">
              <Flame className="h-3 w-3 mr-1" />
              Spicy
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg">{dish.name}</h3>
          <p className="font-bold text-primary text-lg whitespace-nowrap ml-2">
            ₹{dish.price.toFixed(2)}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {dish.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{dish.calories} cal</span>
          
          <Button
            size="sm"
            onClick={onAddToCart}
            disabled={!dish.is_available}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishCard;
