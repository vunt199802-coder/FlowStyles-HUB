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

  app.get("/api/service-categories/:id", async (req, res) => {
    try {
      const category = await storage.getServiceCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Service category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to get service category" });
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

  app.put("/api/service-categories/:id", async (req, res) => {
    try {
      const parsed = insertServiceCategorySchema.partial().parse(req.body);
      const category = await storage.updateServiceCategory(req.params.id, parsed);
      if (!category) {
        return res.status(404).json({ error: "Service category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid service category data" });
    }
  });

  app.delete("/api/service-categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteServiceCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service category" });
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

  app.put("/api/services/:id", async (req, res) => {
    try {
      const parsed = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, parsed);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
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

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const parsed = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(req.params.id, parsed);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
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

  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete booking" });
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

  app.get("/api/portfolio/image/:id", async (req, res) => {
    try {
      const image = await storage.getPortfolioImage(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Portfolio image not found" });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to get portfolio image" });
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

  app.put("/api/portfolio/:id", async (req, res) => {
    try {
      const parsed = insertPortfolioImageSchema.partial().parse(req.body);
      const image = await storage.updatePortfolioImage(req.params.id, parsed);
      if (!image) {
        return res.status(404).json({ error: "Portfolio image not found" });
      }
      res.json(image);
    } catch (error) {
      res.status(400).json({ error: "Invalid portfolio image data" });
    }
  });

  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePortfolioImage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Portfolio image not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete portfolio image" });
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

  app.get("/api/messages/single/:id", async (req, res) => {
    try {
      const message = await storage.getMessage(req.params.id);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to get message" });
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

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMessage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
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

  app.get("/api/message-templates/single/:id", async (req, res) => {
    try {
      const template = await storage.getMessageTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Message template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to get message template" });
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

  app.put("/api/message-templates/:id", async (req, res) => {
    try {
      const parsed = insertMessageTemplateSchema.partial().parse(req.body);
      const template = await storage.updateMessageTemplate(req.params.id, parsed);
      if (!template) {
        return res.status(404).json({ error: "Message template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ error: "Invalid message template data" });
    }
  });

  app.delete("/api/message-templates/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMessageTemplate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Message template not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message template" });
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

  app.get("/api/hair-history/entry/:id", async (req, res) => {
    try {
      const entry = await storage.getHairHistoryEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Hair history entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to get hair history entry" });
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

  app.put("/api/hair-history/:id", async (req, res) => {
    try {
      const parsed = insertHairHistorySchema.partial().parse(req.body);
      const entry = await storage.updateHairHistoryEntry(req.params.id, parsed);
      if (!entry) {
        return res.status(404).json({ error: "Hair history entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid hair history data" });
    }
  });

  app.delete("/api/hair-history/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteHairHistoryEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Hair history entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete hair history entry" });
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
