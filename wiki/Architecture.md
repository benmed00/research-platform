# Architecture

## Global System Architecture

The Research Platform follows a modern, full-stack web application architecture built on Next.js 14 with the App Router pattern. The system is designed as a monolithic application with clear separation between frontend presentation, API layer, and data persistence.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                       │
│  (React Components, Tailwind CSS, Leaflet Maps)         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
┌────────────────────▼────────────────────────────────────┐
│              Next.js Application Server                │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Frontend (Server Components)             │  │
│  │  - Pages (app/dashboard/*)                        │  │
│  │  - Components (components/*)                      │  │
│  │  - Layouts (app/layout.tsx)                       │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Layer (API Routes)                    │  │
│  │  - REST Endpoints (app/api/*)                     │  │
│  │  - Authentication (NextAuth.js)                   │  │
│  │  - Business Logic                                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Data Access Layer                         │  │
│  │  - Prisma ORM Client                              │  │
│  │  - Query Optimization                             │  │
│  │  - Transaction Management                         │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                        │
│  - Relational Data (30+ Models)                        │
│  - PostGIS Extension (Geospatial)                      │
│  - Indexes for Performance                             │
└──────────────────────────────────────────────────────────┘
```

## Backend / Frontend Separation

### Frontend Layer

**Location**: `src/app/` and `src/components/`

The frontend is built using Next.js 14 App Router with React Server Components:

- **Pages**: Server-rendered pages in `app/dashboard/*` that fetch data directly from the database
- **Components**: Reusable UI components in `components/` directory
  - Layout components (header, sidebar)
  - Feature components (charts, maps, forms)
  - UI primitives (buttons, cards, inputs)
- **Client Components**: Marked with `"use client"` for interactive features (forms, maps, real-time updates)

**Key Technologies**:
- React 18 with Server Components
- Tailwind CSS for styling
- Lucide React for icons
- React Hook Form for form management
- Recharts for data visualization
- React Leaflet for mapping

### Backend Layer

**Location**: `src/app/api/`

The backend consists of Next.js API Routes organized by resource:

- **RESTful Endpoints**: Each resource has routes for CRUD operations
  - `GET /api/{resource}` - List resources
  - `GET /api/{resource}/[id]` - Get single resource
  - `POST /api/{resource}` - Create resource
  - `PUT/PATCH /api/{resource}/[id]` - Update resource
  - `DELETE /api/{resource}/[id]` - Delete resource

- **Authentication**: All API routes are protected by NextAuth.js session validation
- **Validation**: Input validation using Zod schemas
- **Error Handling**: Consistent error responses with appropriate HTTP status codes

**API Structure**:
```
app/api/
├── auth/[...nextauth]/route.ts    # NextAuth configuration
├── users/route.ts                 # User management
├── employees/route.ts              # HR management
├── missions/route.ts               # Mission management
├── species/route.ts                # Species catalog
├── equipment/route.ts              # Equipment inventory
├── budgets/route.ts                # Financial budgets
├── expenses/route.ts               # Expense tracking
├── documents/route.ts              # Document management
├── publications/route.ts           # Publication management
├── notifications/route.ts          # Notification system
├── search/route.ts                 # Global search
├── export/excel/route.ts           # Excel export
└── export/pdf/route.ts             # PDF export
```

## Data Flow Overview

### Request Flow

1. **User Action**: User interacts with UI component (clicks button, submits form)
2. **Client Component**: Client-side component handles interaction, calls API
3. **API Route**: Next.js API route receives request, validates session
4. **Business Logic**: Route handler processes request, applies business rules
5. **Data Access**: Prisma client queries/updates database
6. **Response**: JSON response sent back to client
7. **UI Update**: Client component updates UI based on response

### Server Component Flow

1. **Page Request**: User navigates to page (e.g., `/dashboard/missions`)
2. **Server Component**: Next.js renders page component on server
3. **Data Fetching**: Component directly queries database using Prisma
4. **HTML Generation**: Server renders HTML with data
5. **Response**: Complete HTML sent to client
6. **Hydration**: React hydrates on client for interactivity

### Authentication Flow

1. **Login Request**: User submits credentials via login form
2. **NextAuth Handler**: Credentials provider validates against database
3. **Password Verification**: bcrypt compares hashed password
4. **Session Creation**: JWT token created with user ID and role
5. **Login Log**: Login attempt logged in database
6. **Session Storage**: JWT stored in HTTP-only cookie
7. **Subsequent Requests**: Session validated on each API call

## Key Design Decisions

### 1. Monolithic Architecture

**Decision**: Single Next.js application handling both frontend and backend

**Rationale**:
- Simpler deployment and maintenance
- Shared TypeScript types between frontend and backend
- Efficient data fetching with Server Components
- Reduced latency (no network calls between services)

**Trade-offs**:
- Limited horizontal scaling (mitigated by Next.js serverless functions)
- All code in one repository (acceptable for team size)

### 2. Server Components by Default

**Decision**: Use React Server Components for most pages

**Rationale**:
- Better performance (no client-side data fetching)
- Reduced JavaScript bundle size
- Direct database access without API overhead
- Better SEO (fully rendered HTML)

**When Client Components Are Used**:
- Interactive forms (React Hook Form)
- Real-time features (notifications)
- Maps (Leaflet requires client-side rendering)
- Charts (Recharts requires client-side rendering)

### 3. Prisma ORM

**Decision**: Use Prisma instead of raw SQL or other ORMs

**Rationale**:
- Type-safe database access
- Automatic migrations
- Excellent developer experience
- Built-in connection pooling
- Strong TypeScript integration

### 4. JWT Sessions (Stateless)

**Decision**: Use JWT-based sessions instead of database sessions

**Rationale**:
- Stateless authentication (no session storage needed)
- Scalable across multiple server instances
- Faster authentication checks
- Built-in expiration handling

**Trade-offs**:
- Cannot revoke sessions without blacklist (acceptable for this use case)
- Token size limits (mitigated by minimal payload)

### 5. Modular API Structure

**Decision**: Organize API routes by resource/domain

**Rationale**:
- Clear separation of concerns
- Easy to locate and maintain code
- Follows RESTful conventions
- Supports future microservice migration if needed

### 6. Role-Based Access Control (RBAC)

**Decision**: Implement granular permissions per module

**Rationale**:
- Flexible access control for diverse user roles
- Supports complex organizational hierarchy
- Audit trail for all actions
- Future-proof for new roles/permissions

## Scalability Considerations

### Current Architecture Supports

- **Concurrent Users**: 100-500 concurrent users (typical for research center)
- **Data Volume**: 
  - Thousands of species records
  - Tens of thousands of observations
  - Hundreds of missions per year
  - Multi-year financial data
- **Geographic Data**: PostGIS supports complex geospatial queries

### Scaling Strategies

1. **Database Scaling**:
   - Read replicas for reporting queries
   - Connection pooling (Prisma handles this)
   - Index optimization (already implemented)

2. **Application Scaling**:
   - Next.js supports serverless deployment (Vercel, AWS Lambda)
   - Stateless JWT sessions enable horizontal scaling
   - CDN for static assets

3. **Caching**:
   - Next.js built-in caching for static pages
   - API response caching for frequently accessed data
   - Database query result caching (future enhancement)

4. **Future Microservices** (if needed):
   - Current modular structure facilitates extraction
   - API routes can become separate services
   - Shared Prisma schema can be split

### Performance Optimizations

- **Database Queries**: 
  - Aggregation queries (groupBy) instead of fetching all records
  - Selective field queries (select only needed fields)
  - Indexes on frequently queried fields
  - Pagination for large datasets

- **Frontend**:
  - Server Components reduce client-side JavaScript
  - Code splitting by route (Next.js automatic)
  - Image optimization (Next.js Image component)
  - Lazy loading for maps and charts

## Security Architecture

### Authentication

- **Password Hashing**: bcrypt with 10 rounds
- **Session Security**: HTTP-only cookies, secure flag in production
- **CSRF Protection**: NextAuth.js built-in protection
- **Login Logging**: All login attempts logged

### Authorization

- **Role-Based**: 15 predefined roles
- **Permission-Based**: Granular permissions per module (READ, WRITE, VALIDATE, DELETE, ADMIN)
- **Route Protection**: Middleware validates session on all API routes
- **Page Protection**: Server components check session before rendering

### Data Security

- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Prevention**: React automatically escapes content
- **Audit Logging**: All critical actions logged in AuditLog table

## Deployment Architecture

### Recommended Production Setup

```
┌─────────────────┐
│   Load Balancer │
│   (Nginx/Cloud) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ App 1 │ │ App 2│  (Next.js instances)
└───┬───┘ └──┬───┘
    │        │
    └───┬────┘
        │
┌───────▼────────┐
│  PostgreSQL    │
│  (Primary)     │
└───────────────┘
        │
┌───────▼────────┐
│  PostgreSQL    │
│  (Replica)     │  (For read-heavy queries)
└───────────────┘
```

### Environment Configuration

- **Development**: Local PostgreSQL, hot reload enabled
- **Staging**: Cloud database, production-like environment
- **Production**: 
  - Managed PostgreSQL (e.g., AWS RDS, Google Cloud SQL)
  - PostGIS extension enabled
  - Automated backups
  - Monitoring and alerting

## Future Architecture Considerations

### Potential Enhancements

1. **API Gateway**: If moving to microservices
2. **Message Queue**: For async processing (notifications, exports)
3. **File Storage**: Object storage (S3, Cloud Storage) for documents
4. **Search Engine**: Elasticsearch for advanced search capabilities
5. **Caching Layer**: Redis for session storage and query caching
6. **CDN**: For static assets and media files

---

*This architecture is designed to be maintainable, scalable, and secure while remaining simple enough for a small to medium-sized development team.*
