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
  getServiceCategory(id: string): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  updateServiceCategory(id: string, category: Partial<InsertServiceCategory>): Promise<ServiceCategory | undefined>;
  deleteServiceCategory(id: string): Promise<boolean>;
  
  // Services
  getServices(hairstylistId?: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Bookings
  getBookings(clientId?: string, hairstylistId?: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;
  
  // Portfolio
  getPortfolioImages(hairstylistId: string): Promise<PortfolioImage[]>;
  getPortfolioImage(id: string): Promise<PortfolioImage | undefined>;
  createPortfolioImage(image: InsertPortfolioImage): Promise<PortfolioImage>;
  updatePortfolioImage(id: string, image: Partial<InsertPortfolioImage>): Promise<PortfolioImage | undefined>;
  deletePortfolioImage(id: string): Promise<boolean>;
  
  // Messages
  getMessages(userId: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, message: Partial<InsertMessage>): Promise<Message | undefined>;
  markMessageAsRead(id: string): Promise<void>;
  deleteMessage(id: string): Promise<boolean>;
  
  // Message Templates
  getMessageTemplates(hairstylistId: string): Promise<MessageTemplate[]>;
  getMessageTemplate(id: string): Promise<MessageTemplate | undefined>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: string, template: Partial<InsertMessageTemplate>): Promise<MessageTemplate | undefined>;
  deleteMessageTemplate(id: string): Promise<boolean>;
  
  // Hair History
  getHairHistory(clientId: string): Promise<HairHistory[]>;
  getHairHistoryEntry(id: string): Promise<HairHistory | undefined>;
  createHairHistoryEntry(entry: InsertHairHistory): Promise<HairHistory>;
  updateHairHistoryEntry(id: string, entry: Partial<InsertHairHistory>): Promise<HairHistory | undefined>;
  deleteHairHistoryEntry(id: string): Promise<boolean>;
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

  async getServiceCategory(id: string): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
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

  async updateServiceCategory(id: string, updateData: Partial<InsertServiceCategory>): Promise<ServiceCategory | undefined> {
    const category = this.serviceCategories.get(id);
    if (!category) return undefined;
    const updated: ServiceCategory = { 
      ...category, 
      ...updateData,
      description: updateData.description !== undefined ? updateData.description || null : category.description,
      icon: updateData.icon !== undefined ? updateData.icon || null : category.icon,
      color: updateData.color !== undefined ? updateData.color || null : category.color
    };
    this.serviceCategories.set(id, updated);
    return updated;
  }

  async deleteServiceCategory(id: string): Promise<boolean> {
    return this.serviceCategories.delete(id);
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

  async updateService(id: string, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    const updated: Service = { 
      ...service, 
      ...updateData,
      description: updateData.description !== undefined ? updateData.description || null : service.description,
      isActive: updateData.isActive !== undefined ? updateData.isActive : service.isActive
    };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
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

  async updateBooking(id: string, updateData: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated: Booking = { 
      ...booking, 
      ...updateData,
      status: updateData.status || booking.status,
      notes: updateData.notes !== undefined ? updateData.notes || null : booking.notes,
      updatedAt: new Date()
    };
    this.bookings.set(id, updated);
    return updated;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updatedBooking = { ...booking, status, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }

  // Portfolio
  async getPortfolioImages(hairstylistId: string): Promise<PortfolioImage[]> {
    return Array.from(this.portfolioImages.values()).filter(img => img.hairstylistId === hairstylistId);
  }

  async getPortfolioImage(id: string): Promise<PortfolioImage | undefined> {
    return this.portfolioImages.get(id);
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
      tags: (insertImage.tags as string[]) || null,
      createdAt: new Date()
    };
    this.portfolioImages.set(id, image);
    return image;
  }

  async updatePortfolioImage(id: string, updateData: Partial<InsertPortfolioImage>): Promise<PortfolioImage | undefined> {
    const image = this.portfolioImages.get(id);
    if (!image) return undefined;
    const updated: PortfolioImage = { 
      ...image, 
      ...updateData,
      title: updateData.title !== undefined ? updateData.title || null : image.title,
      description: updateData.description !== undefined ? updateData.description || null : image.description,
      beforeImage: updateData.beforeImage !== undefined ? updateData.beforeImage || null : image.beforeImage,
      serviceId: updateData.serviceId !== undefined ? updateData.serviceId || null : image.serviceId,
      tags: updateData.tags !== undefined ? (updateData.tags as string[]) || null : image.tags
    };
    this.portfolioImages.set(id, updated);
    return updated;
  }

  async deletePortfolioImage(id: string): Promise<boolean> {
    return this.portfolioImages.delete(id);
  }

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      msg => msg.senderId === userId || msg.recipientId === userId
    );
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
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

  async updateMessage(id: string, updateData: Partial<InsertMessage>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    const updated: Message = { 
      ...message, 
      ...updateData,
      bookingId: updateData.bookingId !== undefined ? updateData.bookingId || null : message.bookingId,
      messageType: updateData.messageType || message.messageType || "text",
      templateId: updateData.templateId !== undefined ? updateData.templateId || null : message.templateId,
      isRead: updateData.isRead !== undefined ? updateData.isRead : message.isRead
    };
    this.messages.set(id, updated);
    return updated;
  }

  async deleteMessage(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Message Templates
  async getMessageTemplates(hairstylistId: string): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values()).filter(
      template => template.hairstylistId === hairstylistId || template.isDefault
    );
  }

  async getMessageTemplate(id: string): Promise<MessageTemplate | undefined> {
    return this.messageTemplates.get(id);
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

  async updateMessageTemplate(id: string, updateData: Partial<InsertMessageTemplate>): Promise<MessageTemplate | undefined> {
    const template = this.messageTemplates.get(id);
    if (!template) return undefined;
    const updated: MessageTemplate = { 
      ...template, 
      ...updateData,
      hairstylistId: updateData.hairstylistId !== undefined ? updateData.hairstylistId || null : template.hairstylistId,
      category: updateData.category !== undefined ? updateData.category || null : template.category,
      isDefault: updateData.isDefault !== undefined ? updateData.isDefault : template.isDefault
    };
    this.messageTemplates.set(id, updated);
    return updated;
  }

  async deleteMessageTemplate(id: string): Promise<boolean> {
    return this.messageTemplates.delete(id);
  }

  // Hair History
  async getHairHistory(clientId: string): Promise<HairHistory[]> {
    return Array.from(this.hairHistory.values()).filter(entry => entry.clientId === clientId);
  }

  async getHairHistoryEntry(id: string): Promise<HairHistory | undefined> {
    return this.hairHistory.get(id);
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
      previousTreatments: (insertEntry.previousTreatments as string[]) || null,
      allergies: insertEntry.allergies || null,
      preferences: insertEntry.preferences || null,
      notes: insertEntry.notes || null,
      createdAt: new Date()
    };
    this.hairHistory.set(id, entry);
    return entry;
  }

  async updateHairHistoryEntry(id: string, updateData: Partial<InsertHairHistory>): Promise<HairHistory | undefined> {
    const entry = this.hairHistory.get(id);
    if (!entry) return undefined;
    const updated: HairHistory = { 
      ...entry, 
      ...updateData,
      bookingId: updateData.bookingId !== undefined ? updateData.bookingId || null : entry.bookingId,
      hairType: updateData.hairType !== undefined ? updateData.hairType || null : entry.hairType,
      hairLength: updateData.hairLength !== undefined ? updateData.hairLength || null : entry.hairLength,
      hairColor: updateData.hairColor !== undefined ? updateData.hairColor || null : entry.hairColor,
      previousTreatments: updateData.previousTreatments !== undefined ? (updateData.previousTreatments as string[]) || null : entry.previousTreatments,
      allergies: updateData.allergies !== undefined ? updateData.allergies || null : entry.allergies,
      preferences: updateData.preferences !== undefined ? updateData.preferences || null : entry.preferences,
      notes: updateData.notes !== undefined ? updateData.notes || null : entry.notes
    };
    this.hairHistory.set(id, updated);
    return updated;
  }

  async deleteHairHistoryEntry(id: string): Promise<boolean> {
    return this.hairHistory.delete(id);
  }

  private seedData() {
    // Seed service categories
    const categories = [
      { name: "Cuts", description: "Professional haircuts and styling", icon: "Scissors", color: "from-cyan-500 to-blue-500" },
      { name: "Colors", description: "Hair coloring and highlighting", icon: "Palette", color: "from-purple-500 to-pink-500" },
      { name: "Treatments", description: "Deep conditioning and repair treatments", icon: "Sparkles", color: "from-green-500 to-emerald-500" },
      { name: "Styling", description: "Special event and everyday styling", icon: "Wand2", color: "from-orange-500 to-red-500" }
    ];
    
    const categoryIds: string[] = [];
    categories.forEach(cat => {
      const id = randomUUID();
      categoryIds.push(id);
      this.serviceCategories.set(id, { ...cat, id, description: cat.description, icon: cat.icon, color: cat.color });
    });

    // Seed sample hairstylists
    const hairstylists = [
      { username: "sarah_chen", password: "hashed", email: "sarah@salon.com", fullName: "Sarah Chen", role: "hairstylist", bio: "Professional stylist with 8+ years experience", location: "Downtown Salon", profileImage: null },
      { username: "maria_rodriguez", password: "hashed", email: "maria@beauty.com", fullName: "Maria Rodriguez", role: "hairstylist", bio: "Color specialist and wedding expert", location: "Uptown Beauty", profileImage: null },
      { username: "jennifer_kim", password: "hashed", email: "jennifer@style.com", fullName: "Jennifer Kim", role: "hairstylist", bio: "Modern cuts and trendy styles", location: "Style Studio", profileImage: null }
    ];

    const hairstylistIds: string[] = [];
    hairstylists.forEach(stylist => {
      const id = randomUUID();
      hairstylistIds.push(id);
      this.users.set(id, { 
        ...stylist, 
        id, 
        role: "hairstylist",
        profileImage: null,
        bio: stylist.bio,
        location: stylist.location,
        createdAt: new Date() 
      });
    });

    // Seed sample client
    const clientId = randomUUID();
    this.users.set(clientId, {
      id: clientId,
      username: "client_demo",
      password: "hashed",
      email: "client@example.com",
      fullName: "Demo Client",
      role: "client",
      profileImage: null,
      bio: null,
      location: "New York",
      createdAt: new Date()
    });

    // Seed services for each hairstylist
    hairstylistIds.forEach((stylistId, index) => {
      categoryIds.forEach(categoryId => {
        const serviceId = randomUUID();
        const categoryName = categories.find(c => this.serviceCategories.get(categoryId)?.name === c.name)?.name;
        this.services.set(serviceId, {
          id: serviceId,
          hairstylistId: stylistId,
          categoryId: categoryId,
          name: `${categoryName} Service`,
          description: `Professional ${categoryName?.toLowerCase()} service`,
          basePrice: "65.00",
          duration: 90,
          isActive: true,
          createdAt: new Date()
        });
      });
    });

    // Seed sample bookings
    const bookingIds: string[] = [];
    for (let i = 0; i < 3; i++) {
      const bookingId = randomUUID();
      bookingIds.push(bookingId);
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + i + 1);
      
      this.bookings.set(bookingId, {
        id: bookingId,
        clientId: clientId,
        hairstylistId: hairstylistIds[i],
        serviceId: Array.from(this.services.values()).find(s => s.hairstylistId === hairstylistIds[i])!.id,
        appointmentDate: appointmentDate,
        duration: 90,
        status: i === 0 ? "confirmed" : i === 1 ? "pending" : "completed",
        totalPrice: "65.00",
        notes: "First time client",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Seed sample messages
    hairstylistIds.forEach((stylistId, index) => {
      const messageId = randomUUID();
      this.messages.set(messageId, {
        id: messageId,
        senderId: stylistId,
        recipientId: clientId,
        bookingId: bookingIds[index] || null,
        content: `Hi! I'm available for your appointment. Looking forward to working with you!`,
        messageType: "text",
        templateId: null,
        isRead: index > 0,
        createdAt: new Date()
      });
    });

    // Seed sample hair history
    const historyId = randomUUID();
    this.hairHistory.set(historyId, {
      id: historyId,
      clientId: clientId,
      bookingId: bookingIds[2] || null,
      hairType: "Fine",
      hairLength: "Shoulder-length",
      hairColor: "Brown",
      previousTreatments: ["Highlights", "Deep Conditioning"],
      allergies: "None",
      preferences: "Natural looks, low maintenance",
      notes: "Client prefers subtle changes",
      createdAt: new Date()
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
      this.messageTemplates.set(id, { 
        ...template, 
        id, 
        hairstylistId: null,
        category: template.category,
        isDefault: true,
        createdAt: new Date() 
      });
    });
  }
}

export const storage = new MemStorage();
