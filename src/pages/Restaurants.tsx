import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");

  useEffect(() => {
    loadRestaurants();
  }, [cuisineFilter]);

  const loadRestaurants = async () => {
    let query = supabase.from("restaurants").select("*");
    
    if (cuisineFilter !== "all") {
      query = query.eq("cuisine_type", cuisineFilter);
    }
    
    const { data } = await query;
    if (data) setRestaurants(data);
  };

  const filteredRestaurants = restaurants.filter((restaurant: any) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Restaurants</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search restaurants..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant: any) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No restaurants found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
