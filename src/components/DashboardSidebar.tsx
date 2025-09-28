import { Plus, BarChart3, Truck, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  onCreateRequest: () => void;
}

export function DashboardSidebar({ onCreateRequest }: DashboardSidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Create New Request",
      icon: Plus,
      onClick: onCreateRequest,
    },
    {
      title: "Ratings",
      icon: BarChart3,
      onClick: () => {}, // Placeholder for ratings functionality
    },
    {
      title: "Company Portal",
      icon: Building2,
      onClick: () => navigate("/company"),
    },
    {
      title: "Driver Portal",
      icon: Truck,
      onClick: () => navigate("/driver"),
    },
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fuel Shipment System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}