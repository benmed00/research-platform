# Research Platform - Home

## Project Overview

The **Research Platform** is a comprehensive web-based ERP and scientific platform designed for an environmental and biodiversity research center located in northern Morocco. This integrated system serves as the central hub for managing all aspects of research operations, from human resources and finances to scientific data collection and analysis.

## Vision and Objectives

### Primary Objectives

1. **Centralized Management**: Provide a unified platform for managing all research center operations, eliminating data silos and improving coordination between departments.

2. **Scientific Data Management**: Enable comprehensive cataloging, tracking, and analysis of biodiversity data, environmental monitoring, and research findings.

3. **Operational Efficiency**: Streamline administrative processes including HR management, financial tracking, equipment maintenance, and mission planning.

4. **Data-Driven Decision Making**: Provide real-time dashboards and analytics to support evidence-based decision making at all organizational levels.

5. **Knowledge Preservation**: Maintain a comprehensive archive of research data, publications, and documentation with proper versioning and access controls.

### Target Users

The platform serves multiple user groups within the research center:

- **Scientific Staff**: Botanists, zoologists, marine biologists, hydrobiologists, geologists, climatologists
- **Technical Staff**: Laboratory technicians, field technicians, data scientists, GIS specialists
- **Administrative Staff**: Directors, HR managers, financial officers, logisticians
- **Support Staff**: Communication and editing teams, boat pilots, maintenance personnel

## High-Level Architecture Summary

The platform follows a modern, full-stack architecture:

- **Frontend**: Next.js 14 with React, TypeScript, and Tailwind CSS
- **Backend**: Next.js API Routes with Prisma ORM
- **Database**: PostgreSQL with PostGIS extension for geospatial data
- **Authentication**: NextAuth.js with JWT sessions
- **Mapping**: Leaflet for interactive cartography

The application uses a modular architecture where each functional domain (HR, Finance, Missions, Species, etc.) is organized as a separate module with its own API routes, pages, and components.

## Project Status

### Current State: **Production Ready**

The platform is fully functional and ready for production deployment. All core modules have been implemented and tested.

#### ✅ Completed Modules

- **User Management & Authentication**: Complete with 15 predefined roles and granular permissions
- **Human Resources**: Employee management, contracts, salaries, bonuses, leaves, evaluations
- **Finance & Accounting**: Budgets, grants, expenses, invoices, payments, suppliers
- **Equipment & Logistics**: Inventory management, maintenance tracking, mission assignments
- **Missions & Field Campaigns**: Mission planning, team assignments, equipment allocation, GPS tracking, post-mission reports
- **Scientific Database**: Species cataloging (flora/fauna), IUCN status tracking, observations, locations, photos, references
- **Environmental Data**: Water quality, air quality, climate data, geology, sensor data
- **GIS & Cartography**: Interactive maps with multiple layers, GeoJSON support
- **Document Management**: Scientific and administrative reports, raw data, publications, versioning
- **Publication & Editing**: Annual books, chapters, publication workflow

#### 🚧 In Progress / Planned

- **File Upload System**: Structure ready, implementation pending
- **Advanced Export Features**: PDF/Excel export (libraries installed, integration pending)
- **Real-time Notifications**: Basic structure exists, full implementation pending
- **PostGIS Integration**: Database schema ready, full geospatial queries pending
- **Role-based Dashboards**: Partial implementation, full customization pending

### Key Statistics

- **30+ Data Models**: Comprehensive database schema covering all operational aspects
- **25+ Pages**: Complete user interface for all modules
- **40+ API Routes**: RESTful API covering all CRUD operations
- **15 User Roles**: Granular role-based access control
- **6,000+ Lines of Code**: Well-structured, maintainable codebase

## Technology Highlights

- **TypeScript**: Full type safety across the application
- **Prisma ORM**: Type-safe database access with automatic migrations
- **Next.js App Router**: Modern React framework with server components
- **Tailwind CSS**: Utility-first styling for rapid UI development
- **Leaflet**: Open-source mapping library for geospatial visualization

## Getting Started

For new users and developers:

1. **Quick Start**: See [Development Workflow](./Development-Workflow.md) for installation and setup
2. **Architecture Details**: See [Architecture](./Architecture.md) for technical deep-dive
3. **Module Documentation**: See [Core Modules](./Core-Modules.md) for feature details
4. **Contributing**: See [Contribution Guidelines](./Contribution-Guidelines.md) for development workflow

## Default Credentials

After initial setup and database seeding:

- **Email**: `admin@research-platform.ma`
- **Password**: `admin123`

⚠️ **Security Note**: Change the default password immediately after first login in production environments.

## Repository Information

- **GitHub Repository**: https://github.com/benmed00/research-platform
- **License**: Private (Internal use only)
- **Primary Language**: TypeScript
- **Framework**: Next.js 14

## Documentation Index

- [Architecture](./Architecture.md) - System architecture and design patterns
- [Technology Stack](./Technology-Stack.md) - Complete technology overview
- [Project Structure](./Project-Structure.md) - Repository organization
- [Core Modules](./Core-Modules.md) - Detailed module documentation
- [Data Model](./Data-Model.md) - Database schema and relationships
- [Authentication and Roles](./Authentication-and-Roles.md) - Security and access control
- [Development Workflow](./Development-Workflow.md) - Setup and development guide
- [Contribution Guidelines](./Contribution-Guidelines.md) - How to contribute
- [Roadmap](./Roadmap.md) - Features and future plans

---

*Last Updated: Based on repository analysis - January 2025*
