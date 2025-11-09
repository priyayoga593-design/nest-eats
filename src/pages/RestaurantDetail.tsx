import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, ArrowLeft, Leaf } from "lucide-react";
import { toast } from "sonner";
import DishCard from "@/components/DishCard";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [dishes, setDishes] = useState<any[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    loadRestaurant();
    loadDishes();
  }, [id]);

  const loadRestaurant = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) setRestaurant(data);
  };

  const loadDishes = async () => {
    const { data } = await supabase
      .from("dishes")
      .select("*")
      .eq("restaurant_id", id);
    
    if (data) setDishes(data);
  };

  const addToCart = (dish: any) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === dish.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...dish, quantity: 1, restaurant_id: id });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${dish.name} added to cart!`);
  };

  if (!restaurant) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const categories = [...new Set(dishes.map(d => d.category))];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link to="/restaurants">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Restaurants
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={restaurant.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"}
              alt={restaurant.name}
              className="w-full md:w-64 h-48 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-muted-foreground mb-4">{restaurant.description}</p>
                </div>
                <Badge className="text-lg px-4 py-1">{restaurant.cuisine_type}</Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-medium text-lg">{restaurant.rating}</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{restaurant.preparation_time} mins</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    restaurant.is_open ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {restaurant.is_open ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes
                .filter((d) => d.category === category)
                .map((dish) => (
                  <DishCard key={dish.id} dish={dish} onAddToCart={() => addToCart(dish)} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
