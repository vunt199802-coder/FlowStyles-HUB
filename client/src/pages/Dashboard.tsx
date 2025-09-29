import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AIAssistant } from "@/components/AIAssistant";
import { QuickRequest } from "@/components/QuickRequest";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileSection } from "@/components/dashboard/sections/ProfileSection";
import { ServicesSection } from "@/components/dashboard/sections/ServicesSection";
import { BookingsSection } from "@/components/dashboard/sections/BookingsSection";
import { MessagesSection } from "@/components/dashboard/sections/MessagesSection";

interface QuickRequestData {
  category: string;
  budget: string;
  urgency: string;
  state: string;
  city: string;
}

interface ContentAreaProps {
  activeSection: string;
  quickFilter?: QuickRequestData | null;
  onResetFilter?: () => void;
}

function ContentArea({ activeSection, quickFilter, onResetFilter }: ContentAreaProps) {
  const getContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "services":
        return <ServicesSection filter={quickFilter} onResetFilter={onResetFilter} />;
      case "bookings":
        return <BookingsSection />;
      case "messages":
        return <MessagesSection />;
      default:
        return <ServicesSection filter={quickFilter} onResetFilter={onResetFilter} />;
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {getContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("services");
  const [quickFilter, setQuickFilter] = useState<QuickRequestData | null>(null);

  const handleQuickRequest = (data: QuickRequestData) => {
    console.log("Dashboard received quick request:", data);
    setQuickFilter(data);
    setActiveSection("services"); // Ensure we're on the services section
  };

  const handleResetFilter = () => {
    console.log("Resetting filter");
    setQuickFilter(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <div className="flex flex-col flex-1">
            <DashboardHeader />
            <ContentArea 
              activeSection={activeSection} 
              quickFilter={quickFilter}
              onResetFilter={handleResetFilter}
            />
          </div>
        </div>
        <QuickRequest onSubmit={handleQuickRequest} />
        <AIAssistant />
      </SidebarProvider>
    </div>
  );
}
