import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShipmentRequest } from "@/types/shipment";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CreateRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated: (request: ShipmentRequest) => void;
}

export function CreateRequestModal({ open, onOpenChange, onRequestCreated }: CreateRequestModalProps) {
  const [quantity, setQuantity] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [tankCapacity, setTankCapacity] = useState("");
  const [targetStation, setTargetStation] = useState("");
  const [description, setDescription] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const stations = [
    "Downtown Station Alpha",
    "Highway Service Center Beta",
    "Industrial District Gamma",
    "Suburban Hub Delta",
    "Airport Terminal Epsilon"
  ];

  const handleSubmit = () => {
    if (!quantity || !fuelType || !tankCapacity || !targetStation || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      id: `REQ-${Date.now()}`,
      quantity: parseInt(quantity),
      fuelType,
      tankCapacity: parseInt(tankCapacity),
      targetStation,
      description,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // Navigate to payment with request data
    navigate("/payment", { state: { requestData } });
    onOpenChange(false);
    
    // Reset form
    setQuantity("");
    setFuelType("");
    setTankCapacity("");
    setTargetStation("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Fuel Shipment Request</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity Required (Liters)</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity in liters"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 Octane</SelectItem>
                <SelectItem value="91">91 Octane</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tankCapacity">Vehicle Tank Capacity (Liters)</Label>
            <Input
              id="tankCapacity"
              type="number"
              placeholder="Enter tank capacity"
              value={tankCapacity}
              onChange={(e) => setTankCapacity(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="targetStation">Target Station</Label>
            <Select value={targetStation} onValueChange={setTargetStation}>
              <SelectTrigger>
                <SelectValue placeholder="Select target station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Station Address/Description</Label>
            <Textarea
              id="description"
              placeholder="Enter the station's address or description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" variant="hero">
              Continue to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}