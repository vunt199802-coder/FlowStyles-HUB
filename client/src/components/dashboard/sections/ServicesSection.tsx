import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Grid, Scissors, Zap, Sparkles, Heart, ArrowRight, X } from "lucide-react";
import providersData from "@/data/providers.json";

interface QuickRequestFilter {
  category: string;
  urgency: string;
  state: string;
  city: string;
}

interface ServicesSectionProps {
  filter?: QuickRequestFilter | null;
  onResetFilter?: () => void;
}

const serviceCategories = [
  {
    name: "Hairstylists",
    description: "Cuts, color, and professional styling",
    icon: Scissors,
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400"
  },
  {
    name: "Barbers", 
    description: "Fades, beard trims, and classic barbering",
    icon: Zap,
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400"
  },
  {
    name: "Nail Techs",
    description: "Manicures, pedicures, and nail art",
    icon: Sparkles,
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-400"
  },
  {
    name: "Massage Therapists",
    description: "Relaxation, deep tissue, and therapy",
    icon: Heart,
    iconBg: "bg-green-500/20", 
    iconColor: "text-green-400"
  }
];

// Category mapping for QuickRequest integration
const categoryMapping = {
  hairstylists: "Hairstylists",
  barbers: "Barbers", 
  nailtechs: "Nail Techs",
  massage: "Massage Therapists"
};

export function ServicesSection({ filter, onResetFilter }: ServicesSectionProps) {
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setProviderCounts(providersData.totals);
  }, []);

  // Filter categories based on QuickRequest filter
  const filteredCategories = filter?.category 
    ? serviceCategories.filter(category => 
        category.name === categoryMapping[filter.category as keyof typeof categoryMapping]
      )
    : serviceCategories;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
          <Grid className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white" data-testid="services-title">
            Browse Services
          </h2>
          <p className="text-slate-400">
            Discover beauty and wellness providers in your area
          </p>
        </div>
      </motion.div>

      {/* Filter indicator and reset button */}
      {filter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <span className="text-slate-300">Filtering by:</span>
            <span className="text-cyan-400 font-medium">
              {categoryMapping[filter.category as keyof typeof categoryMapping]}
            </span>
            {filter.city && (
              <>
                <span className="text-slate-300">in</span>
                <span className="text-cyan-400 font-medium">{filter.city}</span>
              </>
            )}
          </div>
          {onResetFilter && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetFilter}
              className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-all duration-300"
              data-testid="reset-filter-button"
            >
              <X className="h-4 w-4" />
              <span>Reset Filters</span>
            </motion.button>
          )}
        </motion.div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Service Categories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative cursor-pointer"
              data-testid={`service-card-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="relative p-8 bg-slate-800/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 ${category.iconBg} rounded-xl flex items-center justify-center`}>
                      <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">{category.name}</h4>
                    <p className="text-slate-400 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom section with provider count and explore button */}
                  <div className="flex items-center justify-between mt-8">
                    <span className="text-cyan-400 font-medium" data-testid="provider-count">
                      {providerCounts[category.name] || 0} providers
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                      data-testid={`button-explore-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
