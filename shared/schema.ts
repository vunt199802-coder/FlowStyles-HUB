import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (clients and hairstylists)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("client"), // 'client' or 'hairstylist'
  profileImage: text("profile_image"),
  bio: text("bio"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service categories
export const serviceCategories = pgTable("service_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
});

// Services offered by hairstylists
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hairstylistId: varchar("hairstylist_id").references(() => users.id).notNull(),
  categoryId: varchar("category_id").references(() => serviceCategories.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings/Appointments
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  hairstylistId: varchar("hairstylist_id").references(() => users.id).notNull(),
  serviceId: varchar("service_id").references(() => services.id).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'completed', 'cancelled'
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio images
export const portfolioImages = pgTable("portfolio_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hairstylistId: varchar("hairstylist_id").references(() => users.id).notNull(),
  title: text("title"),
  description: text("description"),
  beforeImage: text("before_image"),
  afterImage: text("after_image").notNull(),
  serviceId: varchar("service_id").references(() => services.id),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages between clients and hairstylists
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  bookingId: varchar("booking_id").references(() => bookings.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'template', 'image'
  templateId: varchar("template_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message templates for hairstylists
export const messageTemplates = pgTable("message_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hairstylistId: varchar("hairstylist_id").references(() => users.id),
  name: text("name").notNull(),
  content: text("content").notNull(),
  category: text("category"), // 'consultation', 'booking_confirmation', 'aftercare', 'follow_up'
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client hair history
export const hairHistory = pgTable("hair_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  bookingId: varchar("booking_id").references(() => bookings.id),
  hairType: text("hair_type"),
  hairLength: text("hair_length"),
  hairColor: text("hair_color"),
  previousTreatments: json("previous_treatments").$type<string[]>(),
  allergies: text("allergies"),
  preferences: text("preferences"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioImageSchema = createInsertSchema(portfolioImages).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertHairHistorySchema = createInsertSchema(hairHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertPortfolioImage = z.infer<typeof insertPortfolioImageSchema>;
export type PortfolioImage = typeof portfolioImages.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;
export type MessageTemplate = typeof messageTemplates.$inferSelect;

export type InsertHairHistory = z.infer<typeof insertHairHistorySchema>;
export type HairHistory = typeof hairHistory.$inferSelect;
