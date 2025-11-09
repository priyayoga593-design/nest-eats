import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Package } from "lucide-react";
import { toast } from "sonner";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        loadOrders(session.user.id);
      }
    });
  }, []);

  const loadOrders = async (userId: string) => {
    const { data } = await supabase
      .from("orders")
      .select(`
        *,
        restaurants (name),
        order_items (
          *,
          dishes (name, image_url)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) setOrders(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-accent/20 text-accent";
      case "preparing":
        return "bg-primary/20 text-primary";
      case "ready":
        return "bg-secondary/20 text-secondary";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const showQRCode = (qrCode: string) => {
    toast.info(`QR Code: ${qrCode}`, { duration: 5000 });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Start ordering to see your history here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {order.restaurants.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <p className="mt-2 font-bold text-primary text-lg">
                        ₹{order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.dishes.image_url}
                          alt={item.dishes.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.dishes.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">₹{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  {order.status === "ready" && (
                    <Button
                      onClick={() => showQRCode(order.qr_code)}
                      className="w-full"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Show QR Code for Pickup
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
