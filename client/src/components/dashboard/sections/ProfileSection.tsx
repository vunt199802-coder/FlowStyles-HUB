import { motion } from "framer-motion";
import { User, Settings, Shield, Bell, ArrowRight } from "lucide-react";

const profileCards = [
  {
    title: "Personal Information",
    description: "Update your name, email, and profile details",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    delay: 0
  },
  {
    title: "Account Settings",
    description: "Manage your preferences and account options",
    icon: Settings,
    gradient: "from-emerald-500 to-teal-500",
    delay: 0.1
  },
  {
    title: "Security Settings",
    description: "Password, two-factor authentication, and privacy",
    icon: Shield,
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    title: "Notifications",
    description: "Control how and when you receive notifications",
    icon: Bell,
    gradient: "from-orange-500 to-red-500",
    delay: 0.3
  }
];

export function ProfileSection() {
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
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
          <User className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white" data-testid="profile-title">
            Profile Settings
          </h2>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {profileCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative cursor-pointer"
            data-testid={`profile-card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
            
            <div className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} bg-opacity-20 border border-opacity-30`}
                  >
                    <card.icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{card.description}</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="self-end px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg text-sm font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center gap-2"
                  data-testid={`button-configure-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Configure <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
