export interface ShipmentRequest {
  id: string;
  quantity: number;
  fuelType: string;
  tankCapacity: number;
  targetStation: string;
  description: string;
  status: string;
  createdAt: string;
}