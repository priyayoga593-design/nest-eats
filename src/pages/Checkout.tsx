import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05;
      const restaurantId = cartItems[0].restaurant_id;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          total_amount: total,
          payment_method: paymentMethod,
          special_instructions: specialInstructions,
          qr_code: `QR-${Date.now()}`,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      localStorage.removeItem("cart");
      
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet">Campus Wallet</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash on Pickup</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
                <Textarea
                  placeholder="Any specific requirements? (e.g., less spicy, no onions, extra sauce)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>₹{(total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{(total * 1.05).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
