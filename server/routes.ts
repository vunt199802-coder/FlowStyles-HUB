import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertServiceCategorySchema, insertServiceSchema, insertBookingSchema,
  insertPortfolioImageSchema, insertMessageSchema, insertMessageTemplateSchema,
  insertHairHistorySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Service Categories
  app.get("/api/service-categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get service categories" });
    }
  });

  app.post("/api/service-categories", async (req, res) => {
    try {
      const parsed = insertServiceCategorySchema.parse(req.body);
      const category = await storage.createServiceCategory(parsed);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid service category data" });
    }
  });

  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const hairstylistId = req.query.hairstylistId as string;
      const services = await storage.getServices(hairstylistId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to get services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to get service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const parsed = insertServiceSchema.parse(req.body);
      const service = await storage.createService(parsed);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  // Bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const clientId = req.query.clientId as string;
      const hairstylistId = req.query.hairstylistId as string;
      const bookings = await storage.getBookings(clientId, hairstylistId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to get booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const parsed = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(parsed);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  // Portfolio
  app.get("/api/portfolio/:hairstylistId", async (req, res) => {
    try {
      const images = await storage.getPortfolioImages(req.params.hairstylistId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to get portfolio images" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const parsed = insertPortfolioImageSchema.parse(req.body);
      const image = await storage.createPortfolioImage(parsed);
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ error: "Invalid portfolio image data" });
    }
  });

  // Messages
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.get("/api/conversations/:userId1/:userId2", async (req, res) => {
    try {
      const messages = await storage.getConversation(req.params.userId1, req.params.userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversation" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(parsed);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Message Templates
  app.get("/api/message-templates/:hairstylistId", async (req, res) => {
    try {
      const templates = await storage.getMessageTemplates(req.params.hairstylistId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to get message templates" });
    }
  });

  app.post("/api/message-templates", async (req, res) => {
    try {
      const parsed = insertMessageTemplateSchema.parse(req.body);
      const template = await storage.createMessageTemplate(parsed);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: "Invalid message template data" });
    }
  });

  // Hair History
  app.get("/api/hair-history/:clientId", async (req, res) => {
    try {
      const history = await storage.getHairHistory(req.params.clientId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to get hair history" });
    }
  });

  app.post("/api/hair-history", async (req, res) => {
    try {
      const parsed = insertHairHistorySchema.parse(req.body);
      const entry = await storage.createHairHistoryEntry(parsed);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid hair history data" });
    }
  });

  // Hairstylists
  app.get("/api/hairstylists", async (req, res) => {
    try {
      const hairstylists = await storage.getHairstylists();
      res.json(hairstylists);
    } catch (error) {
      res.status(500).json({ error: "Failed to get hairstylists" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
