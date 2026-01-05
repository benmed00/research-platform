# Docker Setup Guide

## Overview

This project includes Docker configuration for both development and production environments. The setup includes:

- Multi-stage Dockerfile for optimized production builds
- Docker Compose configuration with PostgreSQL/PostGIS
- Development Dockerfile for hot-reload development

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 4GB of available RAM
- 10GB of free disk space

## Quick Start

### Production Setup

1. **Create environment file**:

```bash
cp .env.example .env
```

Edit `.env` and set:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=research_platform
POSTGRES_PORT=5432
APP_PORT=3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

2. **Start services**:

```bash
docker-compose up -d
```

3. **Run database migrations**:

```bash
docker-compose exec app npx prisma migrate deploy
```

4. **Seed database (optional)**:

```bash
docker-compose exec app npm run db:seed
```

5. **Access the application**:

- Application: http://localhost:3000
- Database: localhost:5432

### Development Setup

1. **Start development environment**:

```bash
docker-compose --profile dev up app-dev postgres
```

2. **Run migrations**:

```bash
docker-compose exec app-dev npx prisma migrate dev
```

3. **Access the application**:

- Application: http://localhost:3000 (with hot-reload)

## Docker Compose Services

### PostgreSQL (postgres)

- **Image**: `postgis/postgis:15-3.3`
- **Port**: 5432
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: Automatic

### Application (app)

- **Build**: Multi-stage Dockerfile
- **Port**: 3000
- **Environment**: Production
- **Depends on**: PostgreSQL

### Development Application (app-dev)

- **Build**: Dockerfile.dev
- **Port**: 3000
- **Environment**: Development
- **Hot Reload**: Enabled
- **Volume Mounts**: Source code for live updates

## Docker Commands

### Build and Start

```bash
# Build and start all services
docker-compose up -d

# Build without cache
docker-compose build --no-cache

# Start specific service
docker-compose up -d postgres
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

### Execute Commands

```bash
# Run Prisma commands
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate deploy

# Run npm commands
docker-compose exec app npm run test

# Access shell
docker-compose exec app sh
```

### Stop and Cleanup

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Database Management

### Run Migrations

```bash
# Production
docker-compose exec app npx prisma migrate deploy

# Development
docker-compose exec app-dev npx prisma migrate dev
```

### Access Database

```bash
# Using psql
docker-compose exec postgres psql -U postgres -d research_platform

# Using Prisma Studio
docker-compose exec app npx prisma studio
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U postgres research_platform > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres research_platform < backup.sql
```

## Production Deployment

### Build for Production

```bash
docker build -t research-platform:latest .
```

### Run Production Container

```bash
docker run -d \
  --name research-platform \
  -p 3000:3000 \
  --env-file .env \
  research-platform:latest
```

### Using Docker Compose

```bash
docker-compose up -d app
```

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL

### Optional

- `SENTRY_DSN` - Sentry error tracking
- `LOG_LEVEL` - Logging level (default: info)
- `POSTGRES_USER` - Database user (default: postgres)
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name (default: research_platform)

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use, change them in `.env`:

```env
APP_PORT=3001
POSTGRES_PORT=5433
```

### Database Connection Issues

1. Check if PostgreSQL is healthy:
```bash
docker-compose ps
```

2. Check database logs:
```bash
docker-compose logs postgres
```

3. Verify connection string in `.env`

### Build Failures

1. Clear Docker cache:
```bash
docker system prune -a
```

2. Rebuild without cache:
```bash
docker-compose build --no-cache
```

### Volume Permission Issues

If you encounter permission issues with volumes:

```bash
sudo chown -R $USER:$USER ./uploads
```

## Development Tips

1. **Hot Reload**: Development container supports hot-reload. Changes to source files are automatically reflected.

2. **Database Changes**: After schema changes, run migrations:
```bash
docker-compose exec app-dev npx prisma migrate dev
```

3. **View Logs**: Keep logs open in a separate terminal:
```bash
docker-compose logs -f app-dev
```

4. **Restart Services**: After environment variable changes:
```bash
docker-compose restart app
```

## Production Considerations

1. **Security**: 
   - Use strong passwords
   - Don't commit `.env` files
   - Use secrets management in production

2. **Performance**:
   - Use production build (`npm run build`)
   - Enable caching
   - Use CDN for static assets

3. **Monitoring**:
   - Set up health checks
   - Monitor container resources
   - Use logging aggregation

4. **Backups**:
   - Regular database backups
   - Volume backups
   - Environment variable backups

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [PostGIS Docker Image](https://hub.docker.com/r/postgis/postgis)

