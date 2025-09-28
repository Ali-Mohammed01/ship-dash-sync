import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShipmentRequest } from "@/types/shipment";
import { ArrowLeft, Package, Truck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Driver = () => {
  const [requests, setRequests] = useState<ShipmentRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRequests = localStorage.getItem("shipmentRequests");
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  const updateRequestStatus = (id: string, status: string) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("shipmentRequests", JSON.stringify(updatedRequests));
  };

  const assignedRequests = requests.filter(req => 
    req.status === "Accepted" || req.status === "Received" || req.status === "On the Way"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "bg-pending text-pending-foreground";
      case "Received": return "bg-warning text-warning-foreground";
      case "On the Way": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getNextAction = (status: string, requestId: string) => {
    switch (status) {
      case "Accepted":
        return (
          <Button
            onClick={() => updateRequestStatus(requestId, "Received")}
            className="bg-warning hover:bg-warning/90 text-warning-foreground"
          >
            <Package className="h-4 w-4 mr-2" />
            Mark as Received
          </Button>
        );
      case "Received":
        return (
          <Button
            onClick={() => updateRequestStatus(requestId, "On the Way")}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Truck className="h-4 w-4 mr-2" />
            Mark as On the Way
          </Button>
        );
      case "On the Way":
        return (
          <Button
            onClick={() => updateRequestStatus(requestId, "Delivered")}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Mark as Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Driver Control Panel
          </h1>
        </div>

        <div className="grid gap-6">
          {assignedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No assigned deliveries at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            assignedRequests.map((request) => (
              <Card key={request.id} className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Delivery #{request.id.slice(-6)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-semibold">{request.quantity} Liters</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{request.fuelType}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-semibold">{request.targetStation}</p>
                      <p className="text-muted-foreground text-sm mt-1">{request.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {getNextAction(request.status, request.id)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Driver;