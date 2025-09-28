import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { RequestCard } from "@/components/RequestCard";
import { CreateRequestModal } from "@/components/CreateRequestModal";
import { ShipmentRequest } from "@/types/shipment";

const Dashboard = () => {
  const [requests, setRequests] = useState<ShipmentRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar onCreateRequest={() => setIsModalOpen(true)} />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Fuel Shipment Dashboard
            </h1>
            
            <div className="grid gap-6">
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No shipment requests yet. Create your first request to get started.
                  </p>
                </div>
              ) : (
                requests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request}
                    onUpdateStatus={updateRequestStatus}
                  />
                ))
              )}
            </div>
          </div>
        </main>

        <CreateRequestModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          onRequestCreated={(newRequest) => {
            const updatedRequests = [...requests, newRequest];
            setRequests(updatedRequests);
            localStorage.setItem("shipmentRequests", JSON.stringify(updatedRequests));
          }}
        />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;