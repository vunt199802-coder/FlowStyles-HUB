import { motion } from "framer-motion";
import { User, Grid, Calendar, MessageSquare, LucideIcon } from "lucide-react";
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

interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { id: "profile", title: "Profile", icon: User },
  { id: "services", title: "Services", icon: Grid },
  { id: "bookings", title: "Bookings", icon: Calendar },
  { id: "messages", title: "Messages", icon: MessageSquare },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="w-64 border-r border-slate-700 bg-slate-900">
      <SidebarContent className="bg-slate-900">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white" data-testid="app-title">
              Stylist Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">Professional Services</p>
          </div>
          
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 px-4 py-3 text-sm font-medium">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 px-3">
                {navigationItems.map((item, index) => (
                  <SidebarMenuItem key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SidebarMenuButton
                        onClick={() => onSectionChange(item.id)}
                        className={`w-full justify-start p-3 rounded-xl transition-all duration-300 group ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg border border-cyan-500/30"
                            : "hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 text-slate-300 hover:text-cyan-300 hover:shadow-md"
                        }`}
                        data-testid={`nav-${item.id}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center w-full"
                        >
                          <item.icon 
                            className={`mr-3 h-5 w-5 transition-colors duration-300 ${
                              activeSection === item.id 
                                ? "text-cyan-400" 
                                : "text-slate-400 group-hover:text-cyan-400"
                            }`} 
                          />
                          <span className="font-medium">{item.title}</span>
                          {activeSection === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                            />
                          )}
                        </motion.div>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
