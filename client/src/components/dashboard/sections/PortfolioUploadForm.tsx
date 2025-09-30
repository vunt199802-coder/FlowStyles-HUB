import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  beforeImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  afterImage: z.string().url("Must be a valid URL").min(1, "After image is required"),
  serviceId: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface Service {
  id: string;
  name: string;
}

interface PortfolioUploadFormProps {
  hairstylistId: string;
  onSuccess: () => void;
}

export function PortfolioUploadForm({ hairstylistId, onSuccess }: PortfolioUploadFormProps) {
  const { toast } = useToast();

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      beforeImage: "",
      afterImage: "",
      serviceId: "",
      tags: "",
    },
  });

  // Fetch services for the dropdown
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const tags = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const portfolioData = {
        hairstylistId,
        title: data.title,
        description: data.description || null,
        beforeImage: data.beforeImage || null,
        afterImage: data.afterImage,
        serviceId: data.serviceId || null,
        tags: tags.length > 0 ? tags : null,
      };

      return apiRequest('POST', '/api/portfolio', portfolioData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio', hairstylistId] });
      toast({
        title: "Success",
        description: "Portfolio image uploaded successfully!",
      });
      form.reset();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload portfolio image",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PortfolioFormData) => {
    uploadMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Blonde Balayage Transformation"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-portfolio-title"
                  {...field}
                />
              </FormControl>
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
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the work, techniques used, or products applied..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-portfolio-description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Before Image URL */}
        <FormField
          control={form.control}
          name="beforeImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Before Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/before.jpg"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-before-image"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-slate-500">Optional: Show the before state</p>
            </FormItem>
          )}
        />

        {/* After Image URL */}
        <FormField
          control={form.control}
          name="afterImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">After Image URL *</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/after.jpg"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-after-image"
                  {...field}
                />
              </FormControl>
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
              <FormLabel className="text-white">Related Service (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="" className="text-white">None</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-white">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="balayage, blonde, color correction (comma-separated)"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-tags"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-slate-500">Separate tags with commas</p>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          disabled={uploadMutation.isPending}
          data-testid="button-submit-portfolio"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload to Portfolio"}
        </Button>
      </form>
    </Form>
  );
}
