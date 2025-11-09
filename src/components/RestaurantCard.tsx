import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description: string;
    cuisine_type: string;
    rating: number;
    preparation_time: number;
    image_url: string;
    is_open: boolean;
  };
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!restaurant.is_open && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg">Closed</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary/90 backdrop-blur">
              {restaurant.cuisine_type}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {restaurant.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{restaurant.preparation_time} mins</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
