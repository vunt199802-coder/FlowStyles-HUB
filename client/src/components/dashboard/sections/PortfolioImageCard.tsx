import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface PortfolioImage {
  id: string;
  title: string | null;
  description: string | null;
  beforeImage: string | null;
  afterImage: string;
  tags: string[] | null;
  createdAt: string;
  service?: {
    name: string;
  };
}

interface PortfolioImageCardProps {
  image: PortfolioImage;
  index: number;
  onClick: () => void;
}

export function PortfolioImageCard({ image, index, onClick }: PortfolioImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative cursor-pointer"
      onClick={onClick}
      data-testid={`portfolio-card-${image.id}`}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
        {/* Image Preview */}
        <div className="relative h-56">
          {image.beforeImage ? (
            <div className="grid grid-cols-2 h-full">
              <div className="relative overflow-hidden">
                <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-xs text-white">
                  Before
                </div>
                <img
                  src={image.beforeImage}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden">
                <div className="absolute top-2 right-2 z-10 bg-purple-500/80 px-2 py-1 rounded text-xs text-white">
                  After
                </div>
                <img
                  src={image.afterImage}
                  alt="After"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-2 right-2 z-10 bg-purple-500/80 px-2 py-1 rounded text-xs text-white">
                Result
              </div>
              <img
                src={image.afterImage}
                alt={image.title || "Portfolio image"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
            {image.title || "Untitled"}
          </h3>
          
          {image.description && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">
              {image.description}
            </p>
          )}

          {image.service && (
            <div className="mb-3">
              <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs border border-cyan-500/30">
                {image.service.name}
              </span>
            </div>
          )}

          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {image.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {image.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">
                  +{image.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(image.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
