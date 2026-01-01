# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue
- Discuss the vulnerability in public forums
- Share the vulnerability with others until it has been resolved

### Please DO:

1. **Email us directly** at: [security@research-platform.ma] (or create a private security advisory on GitHub)
2. **Include details**:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- We will acknowledge receipt of your report within 48 hours
- We will provide a detailed response within 7 days
- We will keep you informed of our progress
- We will notify you when the vulnerability has been fixed

### Security Best Practices

When using this platform:

1. **Keep dependencies updated**: Run `npm audit` regularly
2. **Use strong passwords**: Especially for admin accounts
3. **Enable 2FA**: For GitHub and application accounts
4. **Review access logs**: Regularly check authentication logs
5. **Keep secrets secure**: Never commit secrets to the repository
6. **Use environment variables**: For all sensitive configuration

### Known Security Features

- ✅ Password hashing with bcrypt
- ✅ Session management with NextAuth.js
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection (React default escaping)
- ✅ CSRF protection (NextAuth.js)
- ✅ Secure headers (Next.js defaults)
- ✅ Environment variable validation

### Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2). Critical security fixes may be released as hotfixes outside the normal release cycle.

## Disclosure Policy

- Vulnerabilities will be disclosed after a fix has been released
- We will credit security researchers who responsibly disclose vulnerabilities
- We will maintain a security advisories page for public disclosure

## Security Checklist for Contributors

- [ ] No hardcoded secrets or credentials
- [ ] All user inputs are validated and sanitized
- [ ] SQL queries use parameterized statements (Prisma)
- [ ] Authentication and authorization checks are in place
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date and secure
- [ ] Security headers are properly configured

Thank you for helping keep Research Platform and our users safe!

