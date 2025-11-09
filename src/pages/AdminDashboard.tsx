import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, UtensilsCrossed, Package, Users } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalDishes: 0,
    totalOrders: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const hasAdminRole = roles?.some((r) => r.role === "admin");
    
    if (!hasAdminRole) {
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadStats();
  };

  const loadStats = async () => {
    const [restaurants, dishes, orders, profiles] = await Promise.all([
      supabase.from("restaurants").select("id", { count: "exact", head: true }),
      supabase.from("dishes").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      totalRestaurants: restaurants.count || 0,
      totalDishes: dishes.count || 0,
      totalOrders: orders.count || 0,
      totalUsers: profiles.count || 0,
    });
  };

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Restaurants</p>
                  <p className="text-3xl font-bold">{stats.totalRestaurants}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Dishes</p>
                  <p className="text-3xl font-bold">{stats.totalDishes}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="w-full">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="py-6">
                <p className="text-muted-foreground">Order management coming soon...</p>
              </TabsContent>
              
              <TabsContent value="restaurants" className="py-6">
                <p className="text-muted-foreground">Restaurant management coming soon...</p>
              </TabsContent>
              
              <TabsContent value="users" className="py-6">
                <p className="text-muted-foreground">User management coming soon...</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
