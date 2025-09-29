import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Grid, Scissors, Zap, Sparkles, Heart, Star } from "lucide-react";
import providersData from "@/data/providers.json";

const serviceCategories = [
  {
    name: "Hairstylists",
    description: "Find and connect with professional hairstylists for cuts, color, and styling.",
    icon: Scissors,
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400/50",
    buttonGradient: "from-cyan-500 to-blue-500",
    buttonHover: "hover:from-cyan-600 hover:to-blue-600"
  },
  {
    name: "Barbers",
    description: "Sharp fades, beard trims, and classic barbering services.",
    icon: Zap,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
    hoverBorder: "hover:border-orange-400/50",
    buttonGradient: "from-orange-500 to-red-500",
    buttonHover: "hover:from-orange-600 hover:to-red-600"
  },
  {
    name: "Nail Techs",
    description: "Manicures, pedicures, and creative nail art near you.",
    icon: Sparkles,
    color: "from-pink-500/20 to-purple-500/20",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
    hoverBorder: "hover:border-pink-400/50",
    buttonGradient: "from-pink-500 to-purple-500",
    buttonHover: "hover:from-pink-600 hover:to-purple-600"
  },
  {
    name: "Massage Therapists",
    description: "Relaxation, deep tissue, and therapeutic massage services.",
    icon: Heart,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    hoverBorder: "hover:border-green-400/50",
    buttonGradient: "from-green-500 to-emerald-500",
    buttonHover: "hover:from-green-600 hover:to-emerald-600"
  }
];

export function ServicesSection() {
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setProviderCounts(providersData.totals);
  }, []);

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

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Service Categories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative cursor-pointer"
              data-testid={`service-card-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
              
              <div className={`relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm ${category.hoverBorder} transition-all duration-300`}>
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 bg-gradient-to-r ${category.color} rounded-xl ${category.borderColor}`}
                  >
                    <category.icon className={`h-8 w-8 ${category.iconColor}`} />
                  </motion.div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium">4.8</span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-3">{category.name}</h4>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Providers</span>
                    <span className="text-white font-semibold" data-testid="provider-count">
                      {providerCounts[category.name] || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg. Response Time</span>
                    <span className="text-white font-semibold">2.3 hours</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Starting Price</span>
                    <span className="text-white font-semibold">$45/session</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-gradient-to-r ${category.buttonGradient} text-white py-3 rounded-lg font-medium ${category.buttonHover} transition-all duration-300`}
                    data-testid={`button-browse-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Browse {category.name}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
