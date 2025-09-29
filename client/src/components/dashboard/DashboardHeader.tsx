import { motion } from "framer-motion";
import { Search } from "lucide-react";

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
    </motion.header>
  );
}
