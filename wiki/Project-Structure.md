# Project Structure

## Repository Tree Overview

The Research Platform follows a well-organized, modular structure that separates concerns and makes the codebase maintainable and scalable.

```
research-platform/
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD workflows
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── dependabot.yml          # Dependency updates
├── .githooks/                  # Git hooks
├── docs/                       # Project documentation
│   └── wiki/                   # Wiki documentation (this directory)
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Prisma schema definition
│   └── seed.ts                 # Database seeding script
├── scripts/                    # Utility scripts
│   ├── *.ts                    # TypeScript scripts
│   ├── *.ps1                   # PowerShell scripts
│   └── *.sh                    # Shell scripts
├── src/                        # Application source code
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utility libraries
│   ├── hooks/                  # React hooks
│   ├── types/                  # TypeScript type definitions
│   └── scripts/                # Application scripts
├── public/                     # Static assets (if any)
├── .eslintrc.json             # ESLint configuration
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── tsconfig.seed.json          # TypeScript config for scripts
```

## Major Directories

### `/prisma`

**Purpose**: Database schema definition and migrations

**Contents**:
- `schema.prisma`: Complete database schema with 30+ models
- `seed.ts`: Database seeding script with sample data generation

**Key Files**:
- Defines all database models (User, Mission, Species, Equipment, etc.)
- Relationships between entities
- Enums (UserRole, Permission, EquipmentCategory, etc.)
- Indexes for performance optimization

### `/src/app`

**Purpose**: Next.js App Router pages and API routes

**Structure**:
```
app/
├── api/                        # API routes (backend)
│   ├── auth/                   # Authentication endpoints
│   ├── users/                  # User management API
│   ├── employees/              # HR API
│   ├── missions/               # Mission management API
│   ├── species/                # Species catalog API
│   ├── equipment/              # Equipment API
│   ├── budgets/                # Financial API
│   ├── expenses/               # Expense tracking API
│   ├── documents/              # Document management API
│   ├── publications/          # Publication API
│   ├── notifications/          # Notification API
│   ├── search/                 # Search API
│   └── export/                 # Export functionality
├── auth/                       # Authentication pages
│   └── login/                  # Login page
├── dashboard/                  # Main application pages
│   ├── page.tsx                # Dashboard home
│   ├── users/                  # User management pages
│   ├── rh/                     # HR pages
│   ├── finance/                # Financial pages
│   ├── equipment/              # Equipment pages
│   ├── missions/               # Mission pages
│   ├── species/                # Species pages
│   ├── environment/            # Environmental data pages
│   ├── maps/                   # Mapping pages
│   ├── documents/              # Document pages
│   ├── publications/            # Publication pages
│   └── notifications/           # Notification pages
├── layout.tsx                  # Root layout
├── page.tsx                    # Home page (redirects to dashboard)
├── globals.css                 # Global styles
├── loading.tsx                 # Loading UI
├── error.tsx                   # Error boundary
└── not-found.tsx               # 404 page
```

**Conventions**:
- `route.ts`: API route handlers
- `page.tsx`: Page components
- `layout.tsx`: Layout components
- `[id]`: Dynamic route segments
- `client-page.tsx`: Client components when needed

### `/src/components`

**Purpose**: Reusable React components

**Structure**:
```
components/
├── layout/                     # Layout components
│   ├── header.tsx              # Top navigation header
│   └── sidebar.tsx             # Side navigation menu
├── ui/                         # Base UI components
│   ├── button.tsx             # Button component
│   ├── card.tsx               # Card component
│   ├── input.tsx              # Input component
│   ├── select.tsx             # Select component
│   ├── badge.tsx              # Badge component
│   ├── pagination.tsx         # Pagination component
│   └── ...                     # Other UI primitives
├── dashboard/                  # Dashboard-specific components
│   └── role-dashboard.tsx     # Role-based dashboard
├── charts/                     # Chart components
│   ├── missions-charts.tsx    # Mission charts
│   └── species-charts.tsx     # Species charts
├── map/                        # Map components
│   ├── leaflet-map.tsx        # Main map component
│   ├── map-charts.tsx         # Map visualizations
│   └── map-filters.tsx        # Map filters
├── filters/                    # Filter components
│   ├── equipment-filters.tsx  # Equipment filters
│   ├── missions-filters.tsx   # Mission filters
│   └── species-filters.tsx    # Species filters
├── search/                     # Search components
│   ├── global-search.tsx      # Global search bar
│   └── advanced-search.tsx    # Advanced search
├── notifications/              # Notification components
│   ├── notification-bell.tsx  # Notification icon
│   └── notification-provider.tsx # Notification context
├── export/                     # Export components
│   └── export-buttons.tsx     # Export functionality
├── import/                     # Import components
│   └── import-button.tsx      # Import functionality
├── calendar/                   # Calendar components
│   └── calendar-view.tsx      # Calendar visualization
├── dashboard-charts.tsx        # Main dashboard charts
├── data-table.tsx              # Reusable data table
├── document-preview.tsx        # Document preview
├── filter-bar.tsx             # Filter bar component
├── search-bar.tsx              # Search bar component
└── providers.tsx               # React context providers
```

**Component Organization**:
- Feature-based grouping (map, charts, filters)
- Shared UI components in `ui/`
- Layout components separate from feature components

### `/src/lib`

**Purpose**: Utility functions and shared libraries

**Structure**:
```
lib/
├── auth.ts                     # NextAuth configuration
├── prisma.ts                   # Prisma client singleton
├── utils.ts                    # General utilities
├── validations.ts              # Zod validation schemas
├── permissions.ts              # Permission checking logic
├── dashboard-queries.ts        # Dashboard data queries
├── data-models.ts              # Data model types
├── data-generators.ts          # Sample data generators
├── export-utils.ts             # Export utilities
├── map-export.ts               # Map export functionality
├── notifications.ts            # Notification utilities
└── hooks/                      # Custom React hooks
    └── use-debounce.ts         # Debounce hook
```

**Key Files**:
- `auth.ts`: NextAuth configuration and callbacks
- `prisma.ts`: Singleton Prisma client instance
- `validations.ts`: Zod schemas for form validation
- `permissions.ts`: Role and permission checking

### `/src/types`

**Purpose**: TypeScript type definitions

**Contents**:
- `next-auth.d.ts`: NextAuth type extensions
- Custom types for API responses
- Type definitions for complex data structures

### `/src/hooks`

**Purpose**: Custom React hooks

**Contents**:
- `use-api.ts`: API call hook
- Reusable hooks for common patterns

### `/scripts`

**Purpose**: Utility scripts for development and maintenance

**Types**:
- **TypeScript scripts** (`.ts`): Database operations, Git workflow
- **PowerShell scripts** (`.ps1`): Windows-specific operations
- **Shell scripts** (`.sh`): Unix/Linux operations

**Common Scripts**:
- Database seeding and checking
- Git workflow automation
- File header management
- GitHub repository setup

### `/docs`

**Purpose**: Project documentation

**Contents**:
- Architecture documentation
- Feature documentation
- Setup guides
- Git workflow guides
- API documentation
- Wiki pages (this directory)

### `/.github`

**Purpose**: GitHub repository configuration

**Contents**:
- `workflows/`: GitHub Actions CI/CD workflows
- `ISSUE_TEMPLATE/`: Issue templates for bug reports and feature requests
- `dependabot.yml`: Automated dependency updates

### `/.githooks`

**Purpose**: Git hooks for automation

**Contents**:
- Pre-commit hooks (file header updates)
- Pre-push hooks (tests, if configured)
- Commit message validation

## Naming Conventions

### Files and Directories

**Files**:
- `kebab-case.tsx` for components and pages
- `PascalCase.tsx` for React components (convention)
- `camelCase.ts` for utility files
- `UPPER_CASE` for constants

**Directories**:
- `kebab-case` for feature directories
- `PascalCase` for component directories (React convention)

### Code Conventions

**Variables and Functions**:
- `camelCase` for variables and functions
- `PascalCase` for React components and classes
- `UPPER_SNAKE_CASE` for constants

**Database**:
- `PascalCase` for model names (Prisma convention)
- `camelCase` for field names
- `UPPER_SNAKE_CASE` for enums

**API Routes**:
- RESTful naming: `/api/resource` for collections
- `/api/resource/[id]` for individual resources
- `/api/resource/action` for specific actions

## File Organization Principles

### 1. Feature-Based Organization

Related files are grouped together:
- All mission-related code in `app/dashboard/missions/`
- Mission API routes in `app/api/missions/`
- Mission components in `components/` (if shared)

### 2. Separation of Concerns

- **Pages**: Presentation logic only
- **API Routes**: Business logic and data access
- **Components**: Reusable UI pieces
- **Lib**: Shared utilities and configurations

### 3. Co-location

- Related files are kept close together
- Page-specific components can be in the same directory as the page
- Shared components in `components/` directory

### 4. Scalability

- Structure supports growth
- Easy to add new modules
- Clear patterns for new features
- Minimal refactoring needed when adding features

## Import Paths

### Path Aliases

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

**Usage**:
```typescript
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
```

**Benefits**:
- Cleaner imports
- No relative path confusion (`../../../`)
- Easy refactoring
- Consistent across codebase

## Configuration Files

### Root Level

- `package.json`: Dependencies and npm scripts
- `tsconfig.json`: TypeScript compiler configuration
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `.eslintrc.json`: ESLint rules
- `.gitignore`: Git ignore patterns

### Environment

- `.env`: Environment variables (not in repository)
- `.env.example`: Example environment variables (if present)

## Build Artifacts

### Generated Directories (Not in Repository)

- `node_modules/`: npm dependencies
- `.next/`: Next.js build output
- `.prisma/`: Generated Prisma client
- `dist/`: Build output (if any)

These are excluded via `.gitignore`.

## Module Structure Example

A typical module (e.g., Missions) follows this structure:

```
missions/
├── app/
│   ├── api/missions/
│   │   ├── route.ts              # GET, POST /api/missions
│   │   └── [id]/route.ts         # GET, PUT, DELETE /api/missions/:id
│   └── dashboard/missions/
│       ├── page.tsx              # List page
│       ├── [id]/page.tsx         # Detail page
│       ├── [id]/edit/page.tsx    # Edit page
│       └── new/page.tsx          # Create page
├── components/
│   └── filters/
│       └── missions-filters.tsx  # Mission filters
└── lib/
    └── validations.ts            # Mission validation schemas
```

This pattern is repeated for each major module.

## Best Practices

### 1. Keep Related Code Together

- API routes and pages for the same feature should be logically grouped
- Shared components in `components/`
- Feature-specific components can be co-located

### 2. Use Consistent Naming

- Follow established patterns
- Use descriptive names
- Avoid abbreviations

### 3. Minimize Directory Depth

- Avoid deeply nested structures
- Prefer flat structures when possible
- Use clear naming instead of nesting

### 4. Document Complex Structures

- Add README files for complex modules (if needed)
- Comment on non-obvious organization decisions
- Keep documentation up to date

---

*This structure is designed to be intuitive, scalable, and maintainable as the project grows.*
