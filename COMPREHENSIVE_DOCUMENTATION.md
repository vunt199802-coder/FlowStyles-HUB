# Comprehensive Beauty & Wellness Platform Documentation

This document provides a complete overview of the codebase architecture, including all key files, services, types, and configuration.

---

## Table of Contents

1. [Package Configuration](#1-package-configuration)
2. [API Client](#2-api-client)
3. [Authentication System](#3-authentication-system)
4. [Provider Search Service](#4-provider-search-service)
5. [Messaging Service](#5-messaging-service)
6. [Jobs Service](#6-jobs-service)
7. [Type Definitions](#7-type-definitions)
8. [Database Schema](#8-database-schema)
9. [Router Configuration](#9-router-configuration)
10. [Job UI Components](#10-job-ui-components)
11. [Environment Configuration](#11-environment-configuration)

---

## 1. Package Configuration

**File:** `package.json`

### Key Scripts
- `npm run dev` - Development server (Express + Vite with HMR)
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Push database schema changes

### Core Dependencies
- **Frontend Framework:** React 18 with TypeScript
- **Backend:** Express.js with session management
- **Database:** PostgreSQL with Drizzle ORM (@neondatabase/serverless)
- **UI Components:** Radix UI primitives + Shadcn/UI
- **State Management:** TanStack Query (React Query v5)
- **Routing:** Wouter (lightweight React router)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Styling:** TailwindCSS with PostCSS

### Key Libraries
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.60.5",
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.18.2",
    "react": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "wouter": "^3.3.5",
    "zod": "^3.24.2"
  }
}
```

---

## 2. API Client

**File:** `client/src/api/client.ts`

The API client provides a configured fetch wrapper with authentication credentials.

```typescript
const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export const BASE_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers ?? {});

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = response.statusText || 'Request failed';

    if (errorText) {
      try {
        const parsed = JSON.parse(errorText);
        message = parsed.error || parsed.message || errorText;
      } catch {
        message = errorText;
      }
    }

    const error = new Error(message);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return response;
}
```

### Key Features
- Automatic credential inclusion for session-based auth
- Configurable base URL via environment variable
- Default JSON headers
- Used by all service modules

---

## 3. Authentication System

**File:** `client/src/context/AuthContext.tsx`

React Context providing authentication state and operations throughout the app.

```typescript
interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (input: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}
```

### Authentication Flow
1. **Initial Load:** `loadUser()` fires on mount and sets `user` or `null`.
2. **Session Check:** `GET /api/user` returns the active account; 401 clears `user`.
3. **Login:** `POST /api/login` with `{ email, password }`, then `reloadUser()` to refresh context.
4. **Signup:** `POST /api/register` with `{ firstName, lastName, email, password, role: 'client' }`, finishing with `reloadUser()`.
5. **Logout:** `POST /api/logout` and clear the cached user.

### Usage
```typescript
const { user, isLoading, login, logout } = useAuth();

// Protect routes
if (!user) return <Redirect to="/login" />;
```

---

## 4. Provider Search Service

**File:** `client/src/services/providers.ts`

Service for searching and filtering beauty service providers.

```typescript
export interface SearchFilters {
  type?: string;
  city?: string;
  state?: string;
}

export async function searchProviders(filters: SearchFilters = {}): Promise<Provider[]> {
  const params = new URLSearchParams();

  if (filters.type) params.append('type', filters.type);
  if (filters.city) params.append('city', filters.city);
  if (filters.state) params.append('state', filters.state);

  const response = await apiFetch(`/api/service-providers/search${params.toString() ? `?${params.toString()}` : ''}`);
  const data = (await response.json()) as { providers?: any[]; total?: number };

  if (data.total === 0) {
    return mockProviders;
  }

  const providers = Array.isArray(data.providers) ? data.providers : [];

  return providers.map((provider) => ({
    id: provider.id ?? provider.userId,
    businessName: provider.businessName ?? provider.fullName ?? provider.name,
    businessType: provider.businessType ?? provider.role ?? provider.type,
    bio: provider.bio ?? null,
    city: provider.city ?? null,
    state: provider.state ?? null,
    services: provider.services ?? [],
    portfolio: provider.portfolio ?? provider.portfolioPreview ?? [],
  }));
}
```

### API Endpoint
- **GET** `/api/service-providers/search?type=Hairstylist&city={city}&state={state}`
- When `total === 0` the UI falls back to curated mock providers for discovery

---

## 5. Messaging Service

**File:** `client/src/services/messages.ts`

Service for managing conversations and messages between clients and providers.

```typescript
export async function getConversation(conversationId: string): Promise<Message[]> {
  const response = await apiFetch(`/api/messages/${conversationId}`);
  return response.json();
}

export async function sendMessage(data: {
  receiverId: string;
  content: string;
  bookingId?: string;
}): Promise<Message> {
  const response = await apiFetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({
      receiverId: data.receiverId,
      content: data.content,
      ...(data.bookingId ? { bookingId: data.bookingId } : {}),
    }),
  });

  return response.json();
}
```

### API Endpoints
- **GET** `/api/messages/:conversationId` - Fetch a single conversation thread
- **POST** `/api/messages` - Send a message to a receiver (optionally tied to a booking)

> Conversation list and read-status endpoints are not yet exposed by the backend; the UI expects users to supply a known `conversationId` when testing messaging flows.

### Polling Strategy
React Query keeps the active conversation fresh with 45-second polling:

```typescript
useQuery({
  queryKey: ['conversation', conversationId],
  queryFn: () => getConversation(conversationId),
  enabled: !!conversationId,
  refetchInterval: 45000,
});
```

---

## 6. Jobs Service

**File:** `client/src/services/jobs.ts`

Service for managing job postings from clients seeking beauty professionals.

```typescript
export interface JobFilters {
  status?: string;
  category?: string;
  city?: string;
  state?: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  budgetMin?: string;
  budgetMax?: string;
  urgency?: string;
}

// Fetch jobs with optional filters
export async function listJobs(filters: JobFilters = {}): Promise<Job[]> {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.state) params.append('state', filters.state);

  const response = await apiFetch(`/api/jobs?${params.toString()}`);
  
  if (!response.ok) throw new Error('Failed to fetch jobs');
  
  return response.json();
}

// Create new job posting
export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const response = await apiFetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) throw new Error('Failed to create job');
  
  return response.json();
}
```

### API Endpoints
- **GET** `/api/jobs` - List jobs with filtering
- **POST** `/api/jobs` - Create new job
- **GET** `/api/jobs/:id` - Get specific job
- **PATCH** `/api/jobs/:id/status` - Update job status
- **DELETE** `/api/jobs/:id` - Delete job

---

## 7. Type Definitions

**File:** `client/src/types/api.ts`

Centralized TypeScript interfaces for consistent API shapes across the application.

```typescript
// User account information
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'client' | 'stylist' | 'barber' | 'nail_tech' | 'massage_therapist';
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  businessName?: string | null;
  createdAt?: string;
}

// Service provider with services and portfolio
export interface Provider {
  id: string;
  businessName: string;
  businessType: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  services?: Service[];
  portfolio?: PortfolioImage[];
}

// Individual service offering
export interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  duration: number;
}

// Portfolio image (before/after photos)
export interface PortfolioImage {
  id: string;
  afterImage: string;
  beforeImage: string | null;
  title: string | null;
  description?: string | null;
}

// Job posting
export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  budgetMin: string | null;
  budgetMax: string | null;
  urgency: string | null;
  status: string;
  createdAt: string;
  poster?: {
    id: string;
    fullName: string;
    username: string;
  };
}

// Message conversation
export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    fullName: string;
    username: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

// Individual message
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  bookingId: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    username: string;
  };
}

// Message type enum
export enum MessageType {
  TEXT = 'text',
  BOOKING_REQUEST = 'booking_request',
  BOOKING_CONFIRMATION = 'booking_confirmation',
  APPOINTMENT_REMINDER = 'appointment_reminder',
}

// Booking/appointment
export interface Booking {
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
```

---

## 8. Database Schema

**File:** `shared/schema.ts`

Drizzle ORM schema definitions for all database tables.

### Key Tables

#### Users Table
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("client"),
  phone: text("phone"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Services Table
```typescript
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
```

#### Bookings Table
```typescript
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  hairstylistId: varchar("hairstylist_id").references(() => users.id).notNull(),
  serviceId: varchar("service_id").references(() => services.id).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull().default("pending"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

#### Portfolio Images Table
```typescript
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
```

#### Messages Table
```typescript
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  bookingId: varchar("booking_id").references(() => bookings.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"),
  templateId: varchar("template_id"),
  metadata: json("metadata").$type<Record<string, any>>(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Jobs Table
```typescript
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  urgency: text("urgency"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Hair History Table
```typescript
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
```

### Insert Schemas & Types
Drizzle-Zod schemas for type-safe inserts:

```typescript
export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
```

---

## 9. Router Configuration

**File:** `client/src/App.tsx`

Top-level routing with authentication guards.

```typescript
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### Route Structure
- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/` - Dashboard (protected, requires authentication)
- Dashboard contains sub-sections:
  - Profile
  - Services
  - Bookings
  - Messages
  - Portfolio
  - Jobs

---

## 10. Job UI Components

### A. Post Job Page

**File:** `client/src/pages/PostJobPage.tsx`

Form for clients to post new job opportunities.

#### Key Features
- Zod validation schema
- React Hook Form integration
- Cascading state/city dropdowns
- Budget range inputs (optional)
- Urgency selection
- Mutation with cache invalidation

```typescript
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
```

#### Form Submission
```typescript
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
    queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    toast({ title: "Success", description: "Job posted successfully!" });
    setLocation("/jobs");
  },
});
```

### B. Discover Jobs Page

**File:** `client/src/pages/discover-jobs-page.tsx`

Job feed displaying all available job postings.

#### Key Features
- Real-time job list with React Query
- Budget formatting helper
- Urgency color coding
- Responsive grid layout
- Animated cards with Framer Motion
- Search functionality (UI ready)

```typescript
const formatBudget = (min?: string | null, max?: string | null) => {
  if (min && max) return `$${min} - $${max}`;
  else if (min) return `From $${min}`;
  else if (max) return `Up to $${max}`;
  return "Budget not specified";
};

const getUrgencyColor = (urgency?: string | null) => {
  switch (urgency?.toLowerCase()) {
    case 'urgent': return 'text-red-400';
    case 'asap': return 'text-orange-400';
    case 'flexible': return 'text-green-400';
    default: return 'text-slate-400';
  }
};
```

#### Job Card Display
Each job card shows:
- Title and category badge
- Urgency indicator (colored)
- Description (truncated to 3 lines)
- Budget range (formatted)
- Location (city, state)
- Posted time (relative, e.g., "Posted 2 hours ago")
- Apply button

---

## 11. Environment Configuration

### Environment Variables

The application uses the following environment variable for API configuration:

```bash
VITE_API_BASE_URL=http://127.0.0.1:3000
```

**Default Behavior:** If `VITE_API_BASE_URL` is not set, the app defaults to `http://127.0.0.1:3000`

### Frontend Environment Variables
- Must be prefixed with `VITE_` to be accessible in the frontend
- Accessed via `import.meta.env.VITE_*`
- Set in `.env` file in project root (not checked into version control)

### Backend Environment Variables
Available secrets (automatically configured in Replit environment):
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual PostgreSQL credentials
- `SESSION_SECRET` - Express session secret for cookie signing

### Example .env File
```bash
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:3000

# Database (automatically set by Replit)
DATABASE_URL=postgresql://user:password@host:port/database

# Session
SESSION_SECRET=your-secret-key-here
```

---

## Architecture Summary

### Data Flow
1. **Client** makes request via service functions (using `apiFetch`)
2. **API Client** adds credentials and JSON headers
3. **Express Routes** validate with Zod schemas
4. **Storage Layer** (IStorage interface) performs database operations
5. **Database** (PostgreSQL via Drizzle ORM) persists data
6. **Response** flows back through layers to React Query cache

### Authentication Flow
1. User lands on protected route
2. `AuthContext` checks for session via `/api/user`
3. If no session, redirect to `/login`
4. Login form posts to `/api/login`
5. Server validates credentials, creates session
6. Client fetches user data and redirects to dashboard

### State Management
- **Server State:** React Query (TanStack Query v5)
- **Auth State:** React Context
- **Form State:** React Hook Form
- **UI State:** React component state

### Key Design Patterns
- **Service Layer Pattern:** Separate service files for each domain
- **Type Safety:** Shared types between frontend and backend
- **Protected Routes:** HOC pattern for authentication guards
- **Optimistic Updates:** Cache invalidation after mutations
- **Real-Time Updates:** Polling with React Query refetchInterval

---

## Development Workflow

### Starting the Application
```bash
npm run dev
```
This starts:
- Express server on port 3000
- Vite dev server with HMR
- Both integrated in single process

### Database Migrations
```bash
npm run db:push        # Safe sync
npm run db:push --force # Force sync (data loss warning)
```

### TypeScript Type Checking
```bash
npm run check
```

### Building for Production
```bash
npm run build  # Builds both frontend and backend
npm run start  # Runs production build
```

---

## API Endpoints Reference

### Authentication
- `GET /api/user` - Get current user
- `POST /api/login` - Login with credentials
- `POST /api/logout` - Logout and clear session
- `POST /api/signup` - Create new account

### Providers
- `GET /api/service-providers?role=&city=&state=` - Search providers

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking

### Messages
- `GET /api/messages` - List conversations
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:conversationId/read` - Mark as read

### Jobs
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PATCH /api/jobs/:id/status` - Update job status
- `DELETE /api/jobs/:id` - Delete job

### Portfolio
- `GET /api/portfolio/:providerId` - Get provider portfolio
- `POST /api/portfolio` - Upload portfolio image
- `DELETE /api/portfolio/:id` - Delete portfolio image

---

This documentation provides a complete overview of the codebase structure, making it easy to understand how all pieces fit together and how to extend the application with new features.
