# Overview

This is a full-stack web application built with React/Vite frontend and Express backend, designed to showcase deals, coupons, and affiliate offers. The application features a modern, responsive interface with a search-driven experience where users can find deals across three categories: Affiliate, Code, and Coupon. The app includes detailed review pages for services and implements user tracking for analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: TailwindCSS with shadcn/ui component library for consistent, modern design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: In-memory storage implementation with interface for easy database migration
- **API Design**: RESTful endpoints for cards, reviews, and mailing list management

## Database Schema
- **Cards Table**: Stores deal information including service name, category, offer details, pricing, and metadata
- **Reviews Table**: Contains detailed review content with markdown support and cover images
- **Users Table**: Basic user authentication structure
- **Mailing List Table**: Email subscription management

## Key Features
- **Real-time Search**: Client-side filtering across all deal categories
- **Category Tabs**: Organized display of deals by type (Affiliate, Code, Coupon)
- **Deal Cards**: Interactive cards with hover effects, badges, and action buttons
- **Review System**: Dynamic review pages with markdown content rendering
- **Analytics Tracking**: Event tracking for user interactions and conversions
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Development Server**: Hot reload enabled with Vite middleware integration

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database using `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database queries with `drizzle-orm` and `drizzle-zod` for validation

## UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI components
- **Lucide Icons**: Icon library for consistent iconography
- **TailwindCSS**: Utility-first CSS framework

## State Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation

## Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **class-variance-authority**: Component variant management

## Development Tools
- **TypeScript**: Static type checking across the entire application
- **Vite**: Fast development server and build tool
- **ESBuild**: JavaScript bundler for production builds