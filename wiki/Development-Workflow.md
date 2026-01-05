# Development Workflow

## Prerequisites

Before starting development, ensure you have the following installed:

### Required Software

- **Node.js**: Version 18 or higher
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **PostgreSQL**: Version 14 or higher
  - Check version: `psql --version`
  - Download: https://www.postgresql.org/download/

- **Git**: For version control
  - Check version: `git --version`
  - Download: https://git-scm.com/downloads

- **npm or yarn**: Package manager (npm comes with Node.js)

### Optional but Recommended

- **PostGIS Extension**: For geospatial features
- **Prisma Studio**: Database GUI (included with Prisma)
- **VS Code**: Recommended IDE with TypeScript support
- **Docker**: For containerized PostgreSQL (optional)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/benmed00/research-platform.git
cd research-platform
```

### 2. Install Dependencies

```bash
npm install
```

This will:
- Install all npm packages
- Run `postinstall` script to generate Prisma client

### 3. Set Up Database

#### Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE research_platform;

-- (Optional) Install PostGIS extension
\c research_platform
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy example if available, or create new
cp .env.example .env  # If example exists
```

Edit `.env` with your database credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/research_platform?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with initial data
npm run db:seed
```

**Default Admin Credentials** (after seeding):
- Email: `admin@research-platform.ma`
- Password: `admin123`

⚠️ **Change the default password in production!**

## Development Commands

### Start Development Server

```bash
npm run dev
```

The application will be available at:
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled (changes auto-reload)

### Build for Production

```bash
npm run build
```

Creates optimized production build in `.next/` directory.

### Start Production Server

```bash
npm run start
```

Runs production server (requires `npm run build` first).

### Linting

```bash
npm run lint
```

Runs ESLint to check code quality and style.

## Database Commands

### Prisma Commands

```bash
# Generate Prisma client (after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Create migration (recommended for production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database
npm run db:seed

# Reset database (⚠️ deletes all data)
npm run db:reset

# Check database connection
npm run db:check
```

### Database Workflow

**During Development**:
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` (quick, for development)
3. Test changes

**For Production**:
1. Modify `prisma/schema.prisma`
2. Run `npm run db:migrate` (creates migration file)
3. Review migration file
4. Apply migration to production database

## Git Workflow

### Update File Headers

Before committing, update file metadata headers:

```bash
npm run headers:update
```

This updates all TypeScript files with current metadata.

### Create Feature Branch

```bash
npm run git:branch feature/your-feature-name
```

Or manually:
```bash
git checkout -b feature/your-feature-name
```

### Create Commits

**Automated (Recommended)**:
```bash
npm run git:commit-grouped
```

This automatically groups related changes into logical commits.

**Manual**:
```bash
git add .
git commit -m "feat: add new feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Refactoring
- `test:` - Tests
- `chore:` - Maintenance

### Push Branch

```bash
npm run git:push
```

Or manually:
```bash
git push -u origin feature/your-feature-name
```

### Verify Git Setup

```bash
npm run git:verify
```

Checks Git configuration and setup.

## Development Environment

### Environment Variables

**Development** (`.env`):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/research_platform"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key"
```

**Production** (set in hosting platform):
- Use secure, randomly generated secrets
- Use production database URL
- Set `NEXTAUTH_URL` to production domain

### TypeScript Configuration

**Location**: `tsconfig.json`

**Key Settings**:
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- ES2020 target
- Module resolution: bundler

**Usage**:
```typescript
// Use path aliases
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
```

### Code Structure

**Follow these patterns**:

1. **API Routes**: `src/app/api/[resource]/route.ts`
2. **Pages**: `src/app/dashboard/[module]/page.tsx`
3. **Components**: `src/components/[feature]/component.tsx`
4. **Utilities**: `src/lib/[utility].ts`
5. **Types**: `src/types/[types].ts`

## Testing Workflow

### Manual Testing

1. **Start development server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Test features**: Navigate and test functionality
4. **Check console**: Browser and terminal for errors

### Database Testing

**Prisma Studio**:
```bash
npm run db:studio
```

Opens GUI at http://localhost:5555

**Direct Database Access**:
```bash
psql -U username -d research_platform
```

### API Testing

**Using Browser**:
- Navigate to API routes directly
- Check Network tab in DevTools

**Using curl**:
```bash
# Get missions (requires authentication)
curl http://localhost:3000/api/missions \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

## Common Development Tasks

### Adding a New Module

1. **Create database models** in `prisma/schema.prisma`
2. **Run migration**: `npm run db:push`
3. **Create API routes**: `src/app/api/[module]/route.ts`
4. **Create pages**: `src/app/dashboard/[module]/page.tsx`
5. **Create components**: `src/components/[module]/`
6. **Add validation**: `src/lib/validations.ts`
7. **Update navigation**: `src/components/layout/sidebar.tsx`

### Adding a New API Endpoint

1. **Create route file**: `src/app/api/[resource]/route.ts`
2. **Implement handlers**: GET, POST, PUT, DELETE
3. **Add authentication**: Use `requireAuth()` or `requireAdmin()`
4. **Add validation**: Use Zod schemas
5. **Test endpoint**: Use browser or API client

### Adding a New Page

1. **Create page file**: `src/app/dashboard/[module]/page.tsx`
2. **Fetch data**: Use Prisma in Server Component
3. **Create UI**: Use components from `src/components/`
4. **Add navigation**: Update sidebar if needed
5. **Test page**: Navigate and verify functionality

### Adding a New Component

1. **Create component**: `src/components/[feature]/component.tsx`
2. **Use TypeScript**: Define props interface
3. **Style with Tailwind**: Use utility classes
4. **Export component**: `export default Component`
5. **Use in pages**: Import and use component

## Debugging

### Common Issues

**Database Connection Error**:
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Check database exists
- Verify credentials

**Prisma Client Error**:
```bash
npm run db:generate
```

**Module Not Found**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**:
- Check `tsconfig.json` configuration
- Verify imports use correct paths
- Run `npm run lint` for hints

**Build Errors**:
- Check for TypeScript errors
- Verify all imports are correct
- Check environment variables are set

### Debug Tools

**Browser DevTools**:
- Console for JavaScript errors
- Network tab for API calls
- React DevTools for component inspection

**Terminal**:
- Next.js shows compilation errors
- Prisma shows database errors
- Check terminal output for details

**Prisma Studio**:
```bash
npm run db:studio
```

Visual database browser for debugging data issues.

## Code Quality

### Linting

**Run linter**:
```bash
npm run lint
```

**Auto-fix** (when possible):
```bash
npm run lint -- --fix
```

### Code Style

**Follow these conventions**:
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Use semicolons
- Use TypeScript strict mode

**ESLint Configuration**: `.eslintrc.json`

### File Headers

All TypeScript files should include metadata headers:

```typescript
/**
 * @file filename.ts
 * @description Brief description
 * @author Author name
 * @created YYYY-MM-DD
 * @updated YYYY-MM-DD
 * @updates Count
 * @lines Line count
 * @size Size in KB
 */
```

Update headers:
```bash
npm run headers:update
```

## Performance Optimization

### Development Performance

- **Fast Refresh**: Enabled by default
- **Incremental Compilation**: TypeScript incremental builds
- **SWC Minification**: Faster than Babel

### Database Performance

- **Connection Pooling**: Prisma handles automatically
- **Query Optimization**: Use `select` to fetch only needed fields
- **Indexes**: Already defined in schema
- **Aggregations**: Use `groupBy` instead of fetching all records

### Build Optimization

- **Code Splitting**: Automatic by Next.js
- **Tree Shaking**: Automatic
- **Image Optimization**: Use Next.js Image component
- **Bundle Analysis**: Use `@next/bundle-analyzer` (if needed)

## Deployment Preparation

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Default password changed
- [ ] Documentation updated

### Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

### Environment Variables (Production)

Set in hosting platform:
- `DATABASE_URL`: Production database
- `NEXTAUTH_URL`: Production domain
- `NEXTAUTH_SECRET`: Strong random secret

## Useful Scripts Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter

# Database
npm run db:generate     # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
npm run db:reset         # Reset database

# Git
npm run headers:update   # Update file headers
npm run git:branch       # Create feature branch
npm run git:commit-grouped # Create grouped commits
npm run git:push         # Push branch
npm run git:verify       # Verify Git setup
```

## Getting Help

### Documentation

- **Project Docs**: `/docs` directory
- **Wiki**: `/wiki` directory (this documentation)
- **README**: Root `README.md`

### Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

### Support

- **GitHub Issues**: Report bugs or request features
- **Project Maintainers**: Contact for questions

---

*Follow this workflow to ensure consistent, high-quality development practices throughout the project.*
