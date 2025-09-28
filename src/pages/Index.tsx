import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/fuel-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Fuel Shipment
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Management System
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-2xl mx-auto">
            Streamline your fuel logistics with our comprehensive tracking and management platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="hero"
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              <Truck className="mr-3 h-6 w-6" />
              Send & Track Fuel Shipments
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button
              onClick={() => {/* Ratings functionality placeholder */}}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-6 h-auto"
            >
              <BarChart3 className="mr-3 h-6 w-6" />
              Ratings
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Fuel Management Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From request creation to delivery confirmation, manage every step of your fuel shipment process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-hover transition-shadow cursor-pointer" onClick={() => navigate("/dashboard")}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Client Dashboard</h3>
                <p className="text-muted-foreground">Create and track fuel shipment requests with real-time status updates</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-hover transition-shadow cursor-pointer" onClick={() => navigate("/company")}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Company Management</h3>
                <p className="text-muted-foreground">Review and approve fuel shipment requests from clients</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-hover transition-shadow cursor-pointer" onClick={() => navigate("/driver")}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pending rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Driver Control</h3>
                <p className="text-muted-foreground">Update delivery status and manage assigned shipments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;