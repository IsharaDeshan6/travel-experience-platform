# Travel Experience Listing Platform

A modern, full-stack travel experience listing platform built with Next.js, featuring user authentication, CRUD operations, image uploads, and social features like saving listings.

## 🌐 Live Demo

[Live Application](https://your-deployed-url.vercel.app) *(will be updated after deployment)*

## 📋 Project Overview

This platform allows users to discover, create, and share unique travel experiences. Users can browse listings, search by category or keywords, save their favorite experiences, and manage their own listings. The application features a modern, responsive UI with smooth animations and an intuitive user experience.

**Key functionalities:**
- Browse travel experiences with infinite scroll pagination
- Full-text search and category filtering
- User authentication (register/login)
- Create, edit, and delete travel listings
- Upload multiple images per listing (1-10 images) with ImageKit cloud storage
- Image carousel navigation on detail pages
- Save/like favorite listings
- User dashboard with personal listings management

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router for server-side rendering and routing
- **React 19** - UI library with modern hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.2** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Sonner** - Toast notifications for user feedback

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth v5** - Authentication with credentials provider
- **Prisma 5.22** - ORM for database management
- **PostgreSQL (Neon)** - Cloud-hosted database
- **bcryptjs** - Password hashing

### Additional Services
- **ImageKit** - Cloud image storage and CDN for listing images
- **Zod** - Schema validation for forms and API requests

## ✨ Features Implemented

### Core Features (Required)
✅ **User Authentication**
- User registration with email and password
- Secure login with JWT sessions
- Password hashing with bcryptjs
- Protected routes and API endpoints

✅ **Travel Listing CRUD**
- Create new listings with title, description, location, price, category, duration, and max guests
- View listing details with full information
- Edit existing listings (owner only)
- Delete listings (owner only)
- Ownership validation on backend

✅ **Browse & Discover**
- Grid layout of all listings on homepage
- Category filtering (Adventure, Beach, Cultural, Food, Nature, Safari)
- Responsive design for mobile, tablet, and desktop

### Optional Features (Implemented)
✅ **Image Upload**
- Multiple image upload (1-10 images per listing)
- ImageKit cloud storage integration
- Automatic image cleanup on listing update/delete
- Image carousel with arrow navigation and dot indicators
- "Cover" badge on first image in form
- File type and size validation

✅ **Search Functionality**
- Full-text search across listing titles, descriptions, and locations
- Debounced search input (500ms) for performance
- Real-time search results

✅ **Pagination**
- Infinite scroll implementation
- Load 12 listings per page
- Intersection Observer API for smooth loading
- Loading states and skeleton screens

✅ **Like/Save System**
- Heart button on each listing card
- Save/unsave listings
- Dedicated "Saved Listings" page
- Persisted in database with SavedListing model

### Additional Enhancements
✅ **UI/UX Improvements**
- Smooth animations and transitions
- Hover effects on cards (lift, shadow, image scale)
- Hero section with animated gradients
- Frosted glass navbar effect
- Creator name and time posted on cards
- Toast notifications for all user actions
- Loading states throughout the app

✅ **Performance Optimizations**
- Image optimization with Next.js Image component
- Database indexing on frequently queried fields
- Efficient pagination with cursor-based loading
- Debounced search to reduce API calls

## 🏗️ Architecture & Key Decisions

### Technology Stack Rationale

**Next.js 16 with App Router**: Chosen for its hybrid rendering capabilities (SSR, SSG, ISR), built-in API routes, and excellent developer experience. The App Router provides a more intuitive file-based routing system and better support for React Server Components.

**PostgreSQL with Prisma**: PostgreSQL offers robust relational data modeling perfect for our listing relationships (User → Listings, User → SavedListings). Prisma provides type-safe database queries and excellent migration tooling, reducing bugs and improving developer productivity.

**NextAuth v5**: Industry-standard authentication solution with built-in security features, session management, and easy integration with Next.js. The credentials provider allows custom authentication logic while maintaining security best practices.

**ImageKit**: Dedicated image CDN provides automatic optimization, resizing, and fast global delivery. This offloads image processing from our servers and ensures fast image loading regardless of user location.

### Authentication Implementation

Authentication uses NextAuth v5 with a credentials provider:

1. **Registration**: Users submit email/password → hashed with bcryptjs (10 salt rounds) → stored in PostgreSQL
2. **Login**: User credentials validated → JWT session created → stored in secure HTTP-only cookies
3. **Session Management**: NextAuth handles session refresh, expiration, and validation
4. **Protected Routes**: Middleware and `auth()` helper protect both pages and API routes
5. **Authorization**: Server actions and API routes verify user ownership before allowing modifications

### Database Structure

The application uses three core models:

**User Model**
- Stores authentication credentials and user profile
- One-to-many relationship with Listings
- One-to-many relationship with SavedListings

**Listing Model**
- Stores all travel experience data
- `images` field: String array supporting 1-10 image URLs
- Indexed fields: userId, category, createdAt, title, location (for fast queries)
- Foreign key: userId with cascade delete

**SavedListing Model**
- Junction table for many-to-many User ↔ Listing relationship
- Composite unique constraint on (userId, listingId) prevents duplicates
- Cascade delete ensures cleanup when users or listings are removed

Key database decisions:
- **Array field for images**: PostgreSQL native array support allows storing multiple images efficiently without a separate table
- **Decimal type for price**: Ensures precise financial calculations without floating-point errors
- **Composite indexes**: Speed up filtered queries (e.g., category + createdAt)
- **Cascade deletes**: Automatic cleanup maintains referential integrity

### One Improvement Given More Time

**Real-time Collaboration Features**: I would implement WebSocket-based real-time updates using Pusher or Socket.io. This would enable:

1. **Live Availability Updates**: Show when listings are fully booked or dates are unavailable
2. **Real-time Notifications**: Notify users when someone likes their listing or when similar experiences are posted
3. **Collaborative Wishlists**: Allow users to create shared trip planning boards with friends
4. **Live Chat**: Enable direct messaging between travelers and experience hosts

This would transform the platform from a static marketplace into an interactive community, increasing engagement and bookings. The technical implementation would involve:
- WebSocket server integration with Next.js API routes
- Optimistic UI updates for perceived speed
- Event-based architecture for scalability
- Redis pub/sub for multi-server deployments

## 💡 Product Thinking: Scaling to 10,000 Listings

**Performance and UX improvements for 10,000+ listings:**

1. **Database Performance**: Implement full-text search indexes using PostgreSQL's `tsvector` and `GIN` indexes on title, description, and location fields. This would reduce search query time from 1000ms+ to under 50ms. Add composite indexes on frequently filtered combinations (category + price range + location).

2. **Advanced Pagination**: Replace simple offset-based pagination with cursor-based pagination using listing IDs. This eliminates performance degradation as users scroll deeper (offset 9000+ becomes very slow). Implement virtual scrolling for the grid to render only visible items.

3. **Caching Strategy**: Introduce Redis caching for popular category lists, search results, and individual listings. Cache invalidation would occur on listing updates. Implement stale-while-revalidate patterns to serve cached content while fetching updates. This could reduce database load by 70-80%.

4. **Search Optimization**: Integrate Elasticsearch or Algolia for instant, typo-tolerant search with faceted filtering (price ranges, guest counts, durations). Pre-compute search indexes and use edge caching for common queries. Add autocomplete suggestions using trie data structures.

5. **Image Optimization**: Implement lazy loading with blur-up placeholders, progressive image loading (LQIP), and WebP format with AVIF fallbacks. Use ImageKit's automatic format selection and responsive image URLs to reduce bandwidth by 60-80%.

6. **Smart Filtering**: Add intelligent filters like "Popular this month," "Under $100," or "Near me" using geolocation. Pre-aggregate statistics (average prices per category, booking counts) in a separate analytics table updated via background jobs.

7. **API Performance**: Implement GraphQL to allow clients to request only needed fields, reducing payload sizes. Use DataLoader to batch and cache database queries, eliminating N+1 problems. Compress API responses with gzip/brotli.

8. **Progressive Loading**: Show skeleton screens immediately, load above-the-fold content first, then progressively enhance with additional data. Prefetch likely next pages based on user scroll behavior using Intersection Observer with larger thresholds.

These optimizations would maintain sub-second response times even with 100,000+ listings while providing a premium user experience.

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- ImageKit account for image storage

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travel-experience-platform.git
   cd travel-experience-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

   # ImageKit Configuration
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_public_key"
   IMAGEKIT_PRIVATE_KEY="your_private_key"
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma db push

   # (Optional) Seed sample data
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Schema

To view and manage your database:
```bash
npx prisma studio
```

### Building for Production

```bash
npm run build
npm run start
```

## 📦 Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Database**
   - Use your Neon PostgreSQL connection string
   - Run Prisma migrations: `npx prisma db push` (or set up in Vercel dashboard)

### Environment Variables for Deployment

Ensure these variables are set in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_URL` (set to your production URL)
- `AUTH_SECRET`
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`

## 🔐 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- HTTP-only secure cookies for session storage
- CSRF protection via NextAuth
- Environment variable protection for sensitive keys
- Server-side validation on all API routes
- Ownership verification for edit/delete operations
- SQL injection prevention via Prisma ORM
- XSS protection through React's built-in escaping

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📝 License

This project is created as part of a technical assessment for Lynkerr.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- Vercel for hosting
- Neon for serverless PostgreSQL
- ImageKit for image CDN
- The Next.js team for an amazing framework
