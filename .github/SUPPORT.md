# Support

## Getting Help

We're here to help! Here are the best ways to get support for the Research Platform:

### 📚 Documentation

Before asking for help, please check our documentation:

- [Quick Start Guide](../QUICKSTART.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [Git Workflow Guide](../docs/GIT_WORKFLOW.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Troubleshooting Guide](../docs/TROUBLESHOOTING.md)

### 💬 Discussions

For questions, ideas, and general discussions:

- [GitHub Discussions](https://github.com/benmed00/research-platform/discussions)
- Use the "Q&A" category for questions
- Use "Ideas" for feature suggestions
- Use "General" for community discussions

### 🐛 Bug Reports

Found a bug? Please open an issue:

- [Create a Bug Report](https://github.com/benmed00/research-platform/issues/new?template=bug_report.md)
- Include steps to reproduce
- Include error messages and logs
- Specify your environment (OS, Node version, etc.)

### ✨ Feature Requests

Have an idea for a new feature?

- [Create a Feature Request](https://github.com/benmed00/research-platform/issues/new?template=feature_request.md)
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity

### 📧 Direct Contact

For security issues or private matters:

- Security: See [SECURITY.md](./SECURITY.md)
- Private inquiries: Use GitHub's private messaging

## Response Times

We aim to respond to:

- **Critical bugs**: Within 24 hours
- **Security issues**: Within 48 hours
- **Feature requests**: Within 1 week
- **General questions**: Within 3-5 days

## Community Guidelines

- Be respectful and professional
- Search existing issues before creating new ones
- Provide as much context as possible
- Be patient - we're volunteers
- Help others when you can

## Common Issues

### Installation Problems

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (requires 20+)
node --version
```

### Database Issues

```bash
# Reset database
npm run db:reset

# Check database connection
npm run db:check

# Regenerate Prisma client
npm run db:generate
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Contributing

Want to help improve the project? See our [Contributing Guide](../CONTRIBUTING.md)!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

Thank you for using Research Platform! 🚀

