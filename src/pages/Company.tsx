import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShipmentRequest } from "@/types/shipment";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Company = () => {
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

  const pendingRequests = requests.filter(req => req.status === "Pending");

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
            Company Management
          </h1>
        </div>

        <div className="grid gap-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No pending requests to review.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id} className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Request #{request.id.slice(-6)}
                        <Badge variant="outline" className="bg-pending text-pending-foreground">
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
                      <p className="text-sm text-muted-foreground">Quantity Required</p>
                      <p className="font-semibold">{request.quantity} Liters</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{request.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tank Capacity</p>
                      <p className="font-semibold">{request.tankCapacity} Liters</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Station</p>
                      <p className="font-semibold">{request.targetStation}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Station Address</p>
                    <p className="text-foreground">{request.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateRequestStatus(request.id, "Accepted")}
                      className="bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Request
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateRequestStatus(request.id, "Rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
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

export default Company;