import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@shared/schema";

export function DiscoverJobsPage() {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const formatBudget = (min?: string | null, max?: string | null) => {
    if (min && max) {
      return `$${min} - $${max}`;
    } else if (min) {
      return `From $${min}`;
    } else if (max) {
      return `Up to $${max}`;
    }
    return "Budget not specified";
  };

  const getUrgencyColor = (urgency?: string | null) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'text-red-400';
      case 'asap':
        return 'text-orange-400';
      case 'flexible':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

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
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
          <Briefcase className="h-6 w-6 text-emerald-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white" data-testid="jobs-title">
            Discover Jobs
          </h2>
          <p className="text-slate-400">Find client job postings in your area</p>
        </div>
        
        <div className="relative">
          <input 
            type="search" 
            placeholder="Search jobs..." 
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
            data-testid="search-jobs"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs?.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative cursor-pointer"
              data-testid={`job-${job.id}`}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              <div className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2" data-testid={`job-title-${job.id}`}>
                        {job.title}
                      </h3>
                      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium mb-3" data-testid={`job-category-${job.id}`}>
                        {job.category}
                      </div>
                    </div>
                    {job.urgency && (
                      <div className={`flex items-center gap-1 ${getUrgencyColor(job.urgency)}`} data-testid={`job-urgency-${job.id}`}>
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">{job.urgency}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-300 leading-relaxed line-clamp-3" data-testid={`job-description-${job.id}`}>
                    {job.description}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-white" data-testid={`job-budget-${job.id}`}>
                        {formatBudget(job.budgetMin, job.budgetMax)}
                      </span>
                    </div>
                    
                    {(job.city || job.state) && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm" data-testid={`job-location-${job.id}`}>
                          {[job.city, job.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-lg text-sm font-medium hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-300"
                    data-testid={`button-apply-${job.id}`}
                  >
                    Apply for Job
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && jobs?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No jobs available at the moment</p>
          <p className="text-slate-500 text-sm mt-2">Check back later for new opportunities</p>
        </motion.div>
      )}
    </motion.div>
  );
}
