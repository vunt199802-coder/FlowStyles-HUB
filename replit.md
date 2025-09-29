# Overview

This is a full-stack web application built as a stylist dashboard for managing services, bookings, profiles, and messages. The application provides a comprehensive interface for beauty service providers to manage their business operations through an intuitive dashboard interface with animated transitions and modern UI components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/UI components built on top of Radix UI primitives
- **Styling**: TailwindCSS with custom CSS variables for theming and dark mode support
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **Animations**: Framer Motion for smooth page transitions and component animations
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: Hot reload with Vite integration in development mode
- **Storage Interface**: Abstract storage layer with in-memory implementation (MemStorage class)
- **API Structure**: RESTful API with /api prefix for all endpoints
- **Error Handling**: Centralized error handling middleware

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM configured
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Drizzle migrations with schema definitions in shared directory
- **Session Storage**: PostgreSQL sessions using connect-pg-simple
- **Development Storage**: In-memory storage fallback for development

## Component Architecture
- **Design System**: Component-based architecture with consistent UI patterns
- **Layout**: Sidebar navigation with collapsible mobile-friendly design
- **Dashboard Sections**: Modular sections for Profile, Services, Bookings, and Messages
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Organization**: Separation of concerns with dedicated folders for UI components, dashboard components, and sections

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for server bundling
- **Type Safety**: Strict TypeScript configuration across frontend, backend, and shared code
- **Development Server**: Integrated development environment with HMR and error overlays
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, @assets/)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with migration support

## UI and Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **TailwindCSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Consistent icon library for UI elements
- **Framer Motion**: Animation library for smooth transitions

## Development Tools
- **Replit Integration**: Development environment plugins for enhanced debugging and banner display
- **TypeScript**: Static type checking and enhanced developer experience
- **Vite**: Fast build tool and development server with plugin ecosystem

## Runtime Libraries
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library for type-safe data handling
- **Date-fns**: Date manipulation utilities

## Session and Authentication
- **Express Sessions**: Session management middleware
- **Connect PG Simple**: PostgreSQL session store integration