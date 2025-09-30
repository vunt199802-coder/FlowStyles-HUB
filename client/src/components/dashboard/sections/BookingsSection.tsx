import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, MapPin, ArrowRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";

interface Booking {
  id: string;
  serviceId: string;
  appointmentDate: string;
  duration: number;
  status: string;
  totalPrice: string;
  notes: string | null;
  service?: {
    name: string;
    description: string | null;
  };
  provider?: {
    fullName: string;
    businessName: string | null;
    city: string | null;
  };
}

export function BookingsSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
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
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
          <Calendar className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white" data-testid="bookings-title">
            Your Bookings
          </h2>
          <p className="text-slate-400">Manage your appointments and history</p>
        </div>
      </motion.div>

      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              data-testid="button-new-booking"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Booking</DialogTitle>
            </DialogHeader>
            <BookingForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-400 py-12">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          No bookings yet. Create your first booking above!
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const appointmentDate = new Date(booking.appointmentDate);
            const providerName = booking.provider?.businessName || booking.provider?.fullName || 'Unknown Provider';
            const location = booking.provider?.city || 'Location TBD';
            
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative"
                data-testid={`booking-${booking.id}`}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                
                <div className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {booking.service?.name || 'Service'}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : booking.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : booking.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                          data-testid={`status-${booking.status}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-3">with {providerName}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(appointmentDate, 'MMM d, yyyy')} at {format(appointmentDate, 'h:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{location}</span>
                        </div>
                      </div>
                      {booking.duration && (
                        <p className="text-xs text-slate-500 mt-2">
                          Duration: {booking.duration} minutes
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-white mb-2">${booking.totalPrice}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg text-sm font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center gap-2"
                        data-testid={`button-view-booking-${booking.id}`}
                      >
                        View Details <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
