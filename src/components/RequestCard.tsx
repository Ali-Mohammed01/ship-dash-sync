import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShipmentRequest } from "@/types/shipment";
import { CheckCircle } from "lucide-react";

interface RequestCardProps {
  request: ShipmentRequest;
  onUpdateStatus: (id: string, status: string) => void;
}

export function RequestCard({ request, onUpdateStatus }: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-pending text-pending-foreground";
      case "Accepted": return "bg-success text-success-foreground";
      case "Rejected": return "bg-destructive text-destructive-foreground";
      case "Received": return "bg-warning text-warning-foreground";
      case "On the Way": return "bg-primary text-primary-foreground";
      case "Delivered": return "bg-success text-success-foreground";
      case "Confirmed": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const canConfirmDelivery = request.status === "Delivered";

  return (
    <Card className="shadow-card hover:shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Request #{request.id.slice(-6)}
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
        <div className="grid md:grid-cols-2 gap-4 mb-4">
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
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Station Address</p>
          <p className="text-foreground">{request.description}</p>
        </div>
        
        {canConfirmDelivery && (
          <Button
            onClick={() => onUpdateStatus(request.id, "Confirmed")}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Delivery
          </Button>
        )}
      </CardContent>
    </Card>
  );
}