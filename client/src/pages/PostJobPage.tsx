import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJob, type CreateJobPayload } from "@/services/jobs";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// States and cities data (imported from QuickRequest logic)
const statesAndCities: Record<string, string[]> = {
  "AL": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  "AK": ["Anchorage", "Fairbanks", "Juneau"],
  "AZ": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  "AR": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"],
  "CA": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
  "CO": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
  "CT": ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury"],
  "DE": ["Wilmington", "Dover", "Newark"],
  "FL": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
  "GA": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah"],
  "HI": ["Honolulu", "Pearl City", "Hilo"],
  "ID": ["Boise", "Meridian", "Nampa", "Idaho Falls"],
  "IL": ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville"],
  "IN": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
  "IA": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"],
  "KS": ["Wichita", "Overland Park", "Kansas City", "Topeka"],
  "KY": ["Louisville", "Lexington", "Bowling Green", "Owensboro"],
  "LA": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
  "ME": ["Portland", "Lewiston", "Bangor"],
  "MD": ["Baltimore", "Columbia", "Germantown", "Silver Spring"],
  "MA": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  "MI": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing"],
  "MN": ["Minneapolis", "Saint Paul", "Rochester", "Duluth"],
  "MS": ["Jackson", "Gulfport", "Southaven", "Hattiesburg"],
  "MO": ["Kansas City", "Saint Louis", "Springfield", "Columbia"],
  "MT": ["Billings", "Missoula", "Great Falls", "Bozeman"],
  "NE": ["Omaha", "Lincoln", "Bellevue", "Grand Island"],
  "NV": ["Las Vegas", "Henderson", "Reno", "North Las Vegas"],
  "NH": ["Manchester", "Nashua", "Concord"],
  "NJ": ["Newark", "Jersey City", "Paterson", "Elizabeth"],
  "NM": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
  "NY": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
  "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  "ND": ["Fargo", "Bismarck", "Grand Forks", "Minot"],
  "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  "OK": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
  "OR": ["Portland", "Salem", "Eugene", "Gresham"],
  "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
  "RI": ["Providence", "Warwick", "Cranston"],
  "SC": ["Columbia", "Charleston", "North Charleston", "Mount Pleasant"],
  "SD": ["Sioux Falls", "Rapid City", "Aberdeen"],
  "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
  "UT": ["Salt Lake City", "West Valley City", "Provo", "West Jordan"],
  "VT": ["Burlington", "South Burlington", "Rutland"],
  "VA": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News"],
  "WA": ["Seattle", "Spokane", "Tacoma", "Vancouver"],
  "WV": ["Charleston", "Huntington", "Morgantown"],
  "WI": ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
  "WY": ["Cheyenne", "Casper", "Laramie"]
};

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a service category"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  urgency: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

const serviceCategories = [
  { value: "hairstylist", label: "Hairstylist" },
  { value: "barber", label: "Barber" },
  { value: "nail_technician", label: "Nail Technician" },
  { value: "massage_therapist", label: "Massage Therapist" }
];

const urgencyOptions = [
  { value: "urgent", label: "Urgent (within 24 hours)" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "flexible", label: "Flexible" }
];

export default function PostJobPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState("");

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      state: "",
      city: "",
      budgetMin: "",
      budgetMax: "",
      urgency: "",
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const payload: CreateJobPayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        city: data.city,
        state: data.state,
        budgetMin: data.budgetMin || undefined,
        budgetMax: data.budgetMax || undefined,
        urgency: data.urgency || undefined,
      };
      return createJob(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Success",
        description: "Job posted successfully!",
      });
      setLocation("/jobs");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobFormData) => {
    createJobMutation.mutate(data);
  };

  const stateOptions = Object.keys(statesAndCities).map(state => ({
    value: state,
    label: state
  }));

  const cityOptions = selectedState ? statesAndCities[selectedState]?.map(city => ({
    value: city,
    label: city
  })) || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/jobs")}
            className="text-slate-400 hover:text-white mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Briefcase className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" data-testid="post-job-title">
                Post a Job
              </h1>
              <p className="text-slate-400">Find the perfect professional for your needs</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Job Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Need a haircut for wedding"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        data-testid="input-job-title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">What are you looking for? *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-category">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {serviceCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-white">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">State *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedState(value);
                          form.setValue("city", ""); // Reset city when state changes
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-state">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                          {stateOptions.map((state) => (
                            <SelectItem key={state.value} value={state.value} className="text-white">
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">City *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedState}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white disabled:opacity-50" data-testid="select-city">
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                          {cityOptions.map((city) => (
                            <SelectItem key={city.value} value={city.value} className="text-white">
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Budget Min (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="input-budget-min"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Budget Max (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="200"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="input-budget-max"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Urgency */}
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Urgency (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-urgency">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {urgencyOptions.map((option) => (
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

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you're looking for in detail..."
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-32"
                        data-testid="input-description"
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
                disabled={createJobMutation.isPending}
                data-testid="button-submit-job"
              >
                {createJobMutation.isPending ? "Posting..." : "Post Job"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
