# Research Platform

[![CI/CD Pipeline](https://github.com/mbwk25/research-platform/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/mbwk25/research-platform/actions)
[![CodeQL](https://github.com/mbwk25/research-platform/workflows/CodeQL%20Analysis/badge.svg)](https://github.com/mbwk25/research-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ERP and scientific platform for environmental and biodiversity research center in northern Morocco

## 🌟 Overview

Research Platform is a comprehensive web-based ERP and scientific platform designed for environmental and biodiversity research centers. Built with modern web technologies, it provides integrated management of research activities, human resources, finances, equipment, missions, species databases, environmental data, and geospatial information.

## ✨ Features

### 🎯 Core Modules

- **👥 User Management & Authentication** - Multi-role system with granular permissions
- **💼 Human Resources** - Employee management, contracts, salaries, leaves
- **💰 Finance & Accounting** - Budgets, expenses, invoices, financial reports
- **🔧 Equipment & Logistics** - Inventory management, maintenance tracking
- **🌍 Field Missions** - Mission planning, team assignment, GPS tracking
- **🌿 Species Database** - Flora and fauna catalog with IUCN status
- **🌊 Environmental Data** - Water quality, air quality, climate data
- **🗺️ GIS & Mapping** - Interactive maps with multiple layers (Leaflet)
- **📄 Document Management** - Scientific reports, publications, versioning
- **📊 Analytics** - Customizable dashboards per role

### 🛠️ Technical Features

- **Modern Stack** - Next.js 14, TypeScript, Prisma, PostgreSQL + PostGIS
- **Authentication** - NextAuth.js with secure session management
- **Real-time Maps** - Leaflet integration with GeoJSON support
- **Data Visualization** - Recharts for analytics and reporting
- **Responsive Design** - Tailwind CSS with modern UI components
- **Type Safety** - Full TypeScript coverage
- **Database** - PostgreSQL with PostGIS for geospatial data

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ with PostGIS extension
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mbwk25/research-platform.git
cd research-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Default Login

- **Email**: `admin@research-platform.ma`
- **Password**: `admin123`

⚠️ **Change the password after first login!**

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started quickly
- [Architecture Overview](./ARCHITECTURE.md) - Technical architecture
- [Git Workflow Guide](./docs/GIT_WORKFLOW.md) - Development workflow
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [API Documentation](./docs/API.md) - API endpoints (coming soon)

## 🏗️ Project Structure

```
research-platform/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and helpers
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── prisma/               # Database schema and migrations
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── public/               # Static assets
```

## 🧪 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🔄 Git Workflow

This project uses a comprehensive Git workflow with:

- **File Metadata Headers** - All TypeScript files include metadata
- **Coherent Commits** - Automated commit grouping
- **Branch Strategy** - Feature/fix/docs branches
- **Pull Requests** - Standardized PR templates
- **Git Hooks** - Automatic header updates

See [Git Workflow Guide](./docs/GIT_WORKFLOW.md) for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration tests
- [ ] E2E testing with Playwright
- [ ] Docker containerization
- [ ] Kubernetes deployment configs
- [ ] Multi-language support (FR/AR/EN)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Export to various formats (CSV, Excel, PDF)

## 🐛 Issues

Found a bug? Have a feature request? Please [open an issue](https://github.com/mbwk25/research-platform/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **mbwk25** - [@mbwk25](https://github.com/mbwk25)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Leaflet for mapping capabilities
- All contributors and users

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/mbwk25/research-platform)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/mbwk25/research-platform)
![GitHub issues](https://img.shields.io/github/issues/mbwk25/research-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/mbwk25/research-platform)

---

⭐ If you find this project useful, please consider giving it a star!

