import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const requestData = location.state?.requestData;

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !holderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your fuel shipment request has been submitted.",
      });
      
      if (requestData) {
        const existingRequests = JSON.parse(localStorage.getItem("shipmentRequests") || "[]");
        const newRequest = {
          ...requestData,
          status: "Pending",
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem("shipmentRequests", JSON.stringify([...existingRequests, newRequest]));
      }
      
      navigate("/dashboard");
    }, 2000);
  };

  const estimatedCost = requestData ? (requestData.quantity * 1.5).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Payment
          </h1>
        </div>

        <div className="grid gap-6">
          {/* Order Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {requestData ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fuel Type:</span>
                    <span className="font-semibold">{requestData.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-semibold">{requestData.quantity} Liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Station:</span>
                    <span className="font-semibold">{requestData.targetStation}</span>
                  </div>
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Cost:</span>
                      <span>${estimatedCost}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No order data available</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="holderName">Cardholder Name</Label>
                <Input
                  id="holderName"
                  placeholder="John Doe"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Shield className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                variant="hero"
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Processing..." : `Pay $${estimatedCost}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;