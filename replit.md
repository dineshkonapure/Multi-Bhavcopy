# NSE-BSE BhavCopy Download Tool

## Overview

This is a financial data utility application that allows users to download BhavCopy (daily stock market data) files from NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) for any trading day. The application features an intuitive calendar interface with market day awareness, holiday detection, and quick date range selection capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (single page application pattern)

**UI Component Strategy**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS with custom design tokens following "Finblue Minimal+" design system
- Dark-themed interface with precise spacing primitives (2, 4, 6, 8, 10, 12, 16, 18px)
- Poppins font family for excellent readability in financial data contexts
- Component composition pattern using class-variance-authority for variant management

**State Management**
- TanStack Query (React Query) for server state management and API caching
- Local React state (useState) for UI interactions like date selection and calendar navigation
- Custom hooks pattern for reusable logic (use-toast, use-mobile)

**Calendar Component Design**
- Custom-built calendar with market-specific logic (not using standard date picker)
- Market day validation preventing weekend and holiday selection
- Date range selection with visual feedback
- IST (Indian Standard Time) timezone handling for accurate market day calculation
- Holiday data hardcoded for 2025 with extensible structure for future years

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and middleware pipeline
- Node.js runtime with ESM module system
- Single API endpoint pattern: POST /api/download-urls

**API Design Philosophy**
- Stateless URL generation - no database queries required for core functionality
- Date-based URL construction using NSE/BSE archive patterns
- Three concurrent download URLs generated per request:
  1. NSE CM BhavCopy (ZIP format)
  2. BSE CM BhavCopy (CSV format)
  3. NSE PR (Corporate Actions) data (ZIP format)

**Data Processing Logic**
- Client-side date validation before API calls
- Server-side date format transformations (YYYYMMDD, DDMMYY patterns)
- URL template patterns matching exchange archive structures

**Development Environment**
- Replit-optimized with hot reload and error overlay plugins
- TypeScript compilation without emission (type checking only)
- Separate build processes for client (Vite) and server (esbuild)

### External Dependencies

**UI Component Libraries**
- @radix-ui/* primitives (accordion, dialog, dropdown, popover, tabs, etc.) - unstyled accessible components
- lucide-react for consistent iconography
- cmdk for command palette functionality
- embla-carousel-react for carousel interactions

**Utility Libraries**
- date-fns for date manipulation and formatting
- class-variance-authority (cva) for component variant management
- clsx + tailwind-merge for conditional className composition
- zod for runtime schema validation

**Database Setup** (Currently Unused)
- Drizzle ORM configured for PostgreSQL with Neon serverless driver
- Schema file exists but not actively used (application is stateless)
- Migration system ready via drizzle-kit if persistence becomes required
- In-memory user storage implementation exists but is not utilized

**Google Fonts Integration**
- Poppins font family loaded via CDN for typography consistency
- Multiple font weights (400, 600, 700, 800) preloaded

**Build & Development Tools**
- tsx for TypeScript execution in development
- esbuild for server bundling in production
- PostCSS with Tailwind CSS and Autoprefixer
- Replit-specific plugins for development banner and cartographer

**Design Rationale**
- Database infrastructure is provisioned but not actively used because the application generates URLs algorithmically rather than storing data
- The stateless approach eliminates database latency and maintains simplicity
- Future features (user preferences, download history) could leverage the existing Drizzle setup without architectural changes