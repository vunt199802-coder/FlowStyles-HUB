import { 
  type User, type InsertUser,
  type ServiceCategory, type InsertServiceCategory,
  type Service, type InsertService,
  type Booking, type InsertBooking,
  type PortfolioImage, type InsertPortfolioImage,
  type Message, type InsertMessage,
  type MessageTemplate, type InsertMessageTemplate,
  type HairHistory, type InsertHairHistory
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getHairstylists(): Promise<User[]>;
  
  // Service Categories
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Services
  getServices(hairstylistId?: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Bookings
  getBookings(clientId?: string, hairstylistId?: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  
  // Portfolio
  getPortfolioImages(hairstylistId: string): Promise<PortfolioImage[]>;
  createPortfolioImage(image: InsertPortfolioImage): Promise<PortfolioImage>;
  
  // Messages
  getMessages(userId: string): Promise<Message[]>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Message Templates
  getMessageTemplates(hairstylistId: string): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  
  // Hair History
  getHairHistory(clientId: string): Promise<HairHistory[]>;
  createHairHistoryEntry(entry: InsertHairHistory): Promise<HairHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private serviceCategories: Map<string, ServiceCategory>;
  private services: Map<string, Service>;
  private bookings: Map<string, Booking>;
  private portfolioImages: Map<string, PortfolioImage>;
  private messages: Map<string, Message>;
  private messageTemplates: Map<string, MessageTemplate>;
  private hairHistory: Map<string, HairHistory>;

  constructor() {
    this.users = new Map();
    this.serviceCategories = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.portfolioImages = new Map();
    this.messages = new Map();
    this.messageTemplates = new Map();
    this.hairHistory = new Map();
    this.seedData();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "client",
      profileImage: insertUser.profileImage || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getHairstylists(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === 'hairstylist');
  }

  // Service Categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async createServiceCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const id = randomUUID();
    const category: ServiceCategory = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null,
      icon: insertCategory.icon || null,
      color: insertCategory.color || null
    };
    this.serviceCategories.set(id, category);
    return category;
  }

  // Services
  async getServices(hairstylistId?: string): Promise<Service[]> {
    const services = Array.from(this.services.values());
    return hairstylistId ? services.filter(s => s.hairstylistId === hairstylistId) : services;
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService, 
      id,
      description: insertService.description || null,
      isActive: insertService.isActive ?? true,
      createdAt: new Date()
    };
    this.services.set(id, service);
    return service;
  }

  // Bookings
  async getBookings(clientId?: string, hairstylistId?: string): Promise<Booking[]> {
    const bookings = Array.from(this.bookings.values());
    let filtered = bookings;
    if (clientId) filtered = filtered.filter(b => b.clientId === clientId);
    if (hairstylistId) filtered = filtered.filter(b => b.hairstylistId === hairstylistId);
    return filtered;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      status: insertBooking.status || "pending",
      notes: insertBooking.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updatedBooking = { ...booking, status, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Portfolio
  async getPortfolioImages(hairstylistId: string): Promise<PortfolioImage[]> {
    return Array.from(this.portfolioImages.values()).filter(img => img.hairstylistId === hairstylistId);
  }

  async createPortfolioImage(insertImage: InsertPortfolioImage): Promise<PortfolioImage> {
    const id = randomUUID();
    const image: PortfolioImage = { 
      ...insertImage, 
      id,
      title: insertImage.title || null,
      description: insertImage.description || null,
      beforeImage: insertImage.beforeImage || null,
      serviceId: insertImage.serviceId || null,
      tags: insertImage.tags || null,
      createdAt: new Date()
    };
    this.portfolioImages.set(id, image);
    return image;
  }

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      msg => msg.senderId === userId || msg.recipientId === userId
    );
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      msg => (msg.senderId === userId1 && msg.recipientId === userId2) || 
             (msg.senderId === userId2 && msg.recipientId === userId1)
    ).sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id,
      bookingId: insertMessage.bookingId || null,
      messageType: insertMessage.messageType || "text",
      templateId: insertMessage.templateId || null,
      isRead: insertMessage.isRead ?? false,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      this.messages.set(id, { ...message, isRead: true });
    }
  }

  // Message Templates
  async getMessageTemplates(hairstylistId: string): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values()).filter(
      template => template.hairstylistId === hairstylistId || template.isDefault
    );
  }

  async createMessageTemplate(insertTemplate: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = randomUUID();
    const template: MessageTemplate = { 
      ...insertTemplate, 
      id,
      hairstylistId: insertTemplate.hairstylistId || null,
      category: insertTemplate.category || null,
      isDefault: insertTemplate.isDefault ?? false,
      createdAt: new Date()
    };
    this.messageTemplates.set(id, template);
    return template;
  }

  // Hair History
  async getHairHistory(clientId: string): Promise<HairHistory[]> {
    return Array.from(this.hairHistory.values()).filter(entry => entry.clientId === clientId);
  }

  async createHairHistoryEntry(insertEntry: InsertHairHistory): Promise<HairHistory> {
    const id = randomUUID();
    const entry: HairHistory = { 
      ...insertEntry, 
      id,
      bookingId: insertEntry.bookingId || null,
      hairType: insertEntry.hairType || null,
      hairLength: insertEntry.hairLength || null,
      hairColor: insertEntry.hairColor || null,
      previousTreatments: insertEntry.previousTreatments || null,
      allergies: insertEntry.allergies || null,
      preferences: insertEntry.preferences || null,
      notes: insertEntry.notes || null,
      createdAt: new Date()
    };
    this.hairHistory.set(id, entry);
    return entry;
  }

  private seedData() {
    // Seed service categories
    const categories = [
      { name: "Cuts", description: "Professional haircuts and styling", icon: "Scissors", color: "from-cyan-500 to-blue-500" },
      { name: "Colors", description: "Hair coloring and highlighting", icon: "Palette", color: "from-purple-500 to-pink-500" },
      { name: "Treatments", description: "Deep conditioning and repair treatments", icon: "Sparkles", color: "from-green-500 to-emerald-500" },
      { name: "Styling", description: "Special event and everyday styling", icon: "Wand2", color: "from-orange-500 to-red-500" }
    ];
    
    categories.forEach(cat => {
      const id = randomUUID();
      this.serviceCategories.set(id, { ...cat, id });
    });

    // Seed default message templates
    const defaultTemplates = [
      { hairstylistId: null, name: "Consultation Request", content: "Hi! I'd like to schedule a consultation to discuss my hair goals. When would be a good time for you?", category: "consultation", isDefault: true },
      { hairstylistId: null, name: "Booking Confirmation", content: "Your appointment is confirmed for {date} at {time}. Please arrive 10 minutes early. Looking forward to seeing you!", category: "booking_confirmation", isDefault: true },
      { hairstylistId: null, name: "Aftercare Instructions", content: "Thank you for choosing our services! Here are some tips to maintain your new look: {instructions}", category: "aftercare", isDefault: true },
      { hairstylistId: null, name: "Follow-up", content: "How are you loving your new hair? I'd love to see how it's holding up! Feel free to reach out if you have any questions.", category: "follow_up", isDefault: true }
    ];

    defaultTemplates.forEach(template => {
      const id = randomUUID();
      this.messageTemplates.set(id, { ...template, id, createdAt: new Date() });
    });
  }
}

export const storage = new MemStorage();
