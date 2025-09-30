import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, X, Upload } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PortfolioUploadForm } from "./PortfolioUploadForm";
import { PortfolioImageCard } from "./PortfolioImageCard";
import { queryClient } from "@/lib/queryClient";

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

export function PortfolioSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  // For now, we'll use a mock hairstylist ID. In a real app, this would come from auth context
  const hairstylistId = "current-user-id";

  const { data: portfolio = [], isLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/portfolio', hairstylistId],
  });

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
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <ImageIcon className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white" data-testid="portfolio-title">
              Portfolio Gallery
            </h2>
            <p className="text-slate-400">
              Showcase your work with before & after transformations
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              data-testid="button-upload-portfolio"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Work
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Add Portfolio Image</DialogTitle>
            </DialogHeader>
            <PortfolioUploadForm
              hairstylistId={hairstylistId}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="text-center text-slate-400 py-12">Loading portfolio...</div>
      ) : portfolio.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <p className="text-lg mb-2">No portfolio images yet</p>
          <p className="text-sm">Upload your best work to attract more clients!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((image, index) => (
            <PortfolioImageCard
              key={image.id}
              image={image}
              index={index}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      )}

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedImage.title || "Portfolio Image"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedImage.beforeImage && (
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Before</p>
                      <img
                        src={selectedImage.beforeImage}
                        alt="Before"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className={selectedImage.beforeImage ? "" : "col-span-2"}>
                    <p className="text-sm text-slate-400 mb-2">After</p>
                    <img
                      src={selectedImage.afterImage}
                      alt="After"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>

                {selectedImage.description && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Description</p>
                    <p className="text-white">{selectedImage.description}</p>
                  </div>
                )}

                {selectedImage.service && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Service</p>
                    <p className="text-white">{selectedImage.service.name}</p>
                  </div>
                )}

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
