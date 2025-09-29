import { motion } from "framer-motion";
import { Users, Activity, Star, CalendarCheck, Search } from "lucide-react";

const stats = [
  { label: "Total Providers", value: "1,247", icon: Users, color: "from-cyan-500 to-blue-500" },
  { label: "Active Services", value: "1", icon: Activity, color: "from-green-500 to-emerald-500" },
  { label: "Avg Rating", value: "4.8", icon: Star, color: "from-yellow-500 to-orange-500" },
  { label: "Monthly Bookings", value: "892", icon: CalendarCheck, color: "from-purple-500 to-pink-500" }
];

export function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-slate-700 bg-slate-900 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white" data-testid="section-title">
            Services
          </h2>
          <p className="text-slate-400 mt-1">Manage your service offerings</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="search" 
              placeholder="Search services..." 
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              data-testid="search-input"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
          <button 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
            data-testid="button-add-service"
          >
            Add Service
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group relative"
            data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} bg-opacity-20 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.header>
  );
}
