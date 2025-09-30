import type { Express } from "express";
import { storage } from "./storage";
import { insertUserSchema, type User } from "@shared/schema";
import { z } from "zod";

// Sanitize user data by removing password
function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...sanitized } = user;
  return sanitized;
}

export function registerAuthRoutes(app: Express) {
  // Registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { role, ...userData } = req.body;
      
      // Parse base user data
      const parsed = insertUserSchema.parse({
        ...userData,
        role: role || 'client',
      });
      
      // When role === 'stylist', require stylist profile fields
      if (parsed.role === 'stylist') {
        if (!parsed.bio || parsed.bio.trim().length === 0) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ['bio'], message: "Bio is required for stylists" }]
          });
        }
        if (!parsed.location || parsed.location.trim().length === 0) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ['location'], message: "Location is required for stylists" }]
          });
        }
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(parsed.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Create user with role
      const user = await storage.createUser(parsed);
      
      // Return sanitized user with role
      res.status(201).json(sanitizeUser(user));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Return sanitized user with role
      res.json(sanitizeUser(user));
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req, res) => {
    try {
      // This would typically use session/token middleware
      // For now, returning a 401 if not implemented
      res.status(401).json({ error: "Not authenticated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });
}
