import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { searchProviders } from "@/services/providers";
import type { Provider } from "@/types/api";

const bookingSchema = z.object({
  providerId: z.string().min(1, "Please select a provider"),
  serviceId: z.string().min(1, "Please select a service"),
  appointmentDate: z.date({ required_error: "Please select a date" }),
  appointmentTime: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Please select duration"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Service {
  id: string;
  name: string;
  basePrice: string;
  duration: number;
}

interface BookingFormProps {
  onSuccess: () => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      providerId: "",
      serviceId: "",
      appointmentTime: "",
      duration: "60",
      notes: "",
    },
  });

  // Fetch providers on mount
  useEffect(() => {
    async function loadProviders() {
      setIsLoadingProviders(true);
      try {
        const data = await searchProviders({});
        setProviders(data);
      } catch (error) {
        console.error("Failed to load providers:", error);
        toast({
          title: "Error",
          description: "Failed to load providers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProviders(false);
      }
    }
    loadProviders();
  }, [toast]);

  // Update selected provider when provider changes
  const providerId = form.watch("providerId");
  useEffect(() => {
    const provider = providers.find(p => p.id === providerId);
    setSelectedProvider(provider || null);
    // Reset service selection when provider changes
    form.setValue("serviceId", "");
  }, [providerId, providers, form]);

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const selectedService = selectedProvider?.services?.find(s => s.id === data.serviceId);
      
      // Combine date and time
      const [hours, minutes] = data.appointmentTime.split(':');
      const appointmentDateTime = new Date(data.appointmentDate);
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const bookingData = {
        hairstylistId: data.providerId,
        serviceId: data.serviceId,
        appointmentDate: appointmentDateTime.toISOString(),
        duration: parseInt(data.duration),
        totalPrice: selectedService?.basePrice || "0",
        notes: data.notes || null,
      };

      return apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: "Success",
        description: "Booking created successfully!",
      });
      form.reset();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  // Time slots (every 30 minutes from 9 AM to 6 PM)
  const timeSlots: Array<{ value: string; label: string }> = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = format(new Date(2000, 0, 1, hour, minute), 'h:mm a');
      timeSlots.push({ value: time, label: displayTime });
    }
  }

  const durationOptions = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
    { value: "150", label: "2.5 hours" },
    { value: "180", label: "3 hours" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Provider Selection */}
        <FormField
          control={form.control}
          name="providerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Provider</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {isLoadingProviders ? (
                    <SelectItem value="loading" disabled>Loading providers...</SelectItem>
                  ) : providers.length === 0 ? (
                    <SelectItem value="none" disabled>No providers available</SelectItem>
                  ) : (
                    providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id} className="text-white">
                        {provider.businessName} - {provider.businessType}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Selection */}
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Service</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!selectedProvider || !selectedProvider.services || selectedProvider.services.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {selectedProvider?.services?.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-white">
                      {service.name} - ${service.basePrice} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white">Appointment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600 ${
                        !field.value && "text-slate-400"
                      }`}
                      data-testid="button-date-picker"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className="rounded-md border-0"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Selection */}
        <FormField
          control={form.control}
          name="appointmentTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Appointment Time</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value} className="text-white">
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration Selection */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Duration</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any special requests or notes..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-notes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          disabled={createBookingMutation.isPending}
          data-testid="button-submit-booking"
        >
          {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
        </Button>
      </form>
    </Form>
  );
}
