import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RestaurantCard from "@/components/RestaurantCard";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    loadRestaurants();

    return () => subscription.unsubscribe();
  }, []);

  const loadRestaurants = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("is_open", true)
      .limit(6);
    
    if (data) setRestaurants(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            CampusEats
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/restaurants" className="text-foreground/80 hover:text-primary transition-colors">
              Restaurants
            </Link>
            {user && (
              <>
                <Link to="/orders" className="text-foreground/80 hover:text-primary transition-colors">
                  My Orders
                </Link>
                <Link to="/cart" className="text-foreground/80 hover:text-primary transition-colors">
                  Cart
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="outline">Profile</Button>
                </Link>
                <Button onClick={async () => {
                  await supabase.auth.signOut();
                }}>Sign Out</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="Campus Food Delivery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-in">
            Delicious Food,
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Delivered to Campus
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in">
            Order from your favorite restaurants and pick up with QR code. Fast, easy, and delicious!
          </p>
          
          <div className="flex gap-4 max-w-2xl animate-slide-in">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search for restaurants or dishes..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/restaurants">
              <Button size="lg" className="h-12 px-8">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-hover transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Pickup</h3>
              <p className="text-muted-foreground">
                Order now and pick up in minutes with QR code scanning
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-hover transition-all">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Rated</h3>
              <p className="text-muted-foreground">
                Discover highly-rated restaurants loved by students
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-hover transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reward Points</h3>
              <p className="text-muted-foreground">
                Earn points on every order and unlock amazing rewards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending Restaurants</h2>
            <Link to="/restaurants">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">CampusEats</h3>
              <p className="text-sm text-muted-foreground">
                Your favorite campus food delivery platform
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/restaurants" className="hover:text-primary">Restaurants</Link></li>
                <li><Link to="/orders" className="hover:text-primary">Orders</Link></li>
                <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 CampusEats. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
