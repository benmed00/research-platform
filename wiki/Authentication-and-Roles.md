# Authentication and Roles

## Authentication System

The Research Platform uses NextAuth.js for authentication, providing a secure, flexible authentication system with JWT-based sessions.

## Authentication Flow

### Login Process

1. **User submits credentials** via login form (`/auth/login`)
2. **NextAuth credentials provider** validates input
3. **Database lookup** for user by email
4. **Password verification** using bcrypt comparison
5. **Account status check** (user must be active)
6. **Login log creation** (successful or failed attempt recorded)
7. **JWT token generation** with user ID and role
8. **Session cookie** set (HTTP-only, secure in production)
9. **Redirect** to dashboard

### Session Management

**Session Type**: JWT (JSON Web Token)

**Benefits**:
- Stateless authentication (no database session storage)
- Scalable across multiple server instances
- Fast authentication checks
- Built-in expiration handling

**Session Storage**:
- Stored in HTTP-only cookie
- Secure flag enabled in production
- SameSite protection against CSRF

**Session Data**:
```typescript
{
  id: string,        // User ID
  email: string,     // User email
  name: string,      // Full name
  role: UserRole      // User role
}
```

### Password Security

**Hashing Algorithm**: bcrypt

**Configuration**:
- 10 rounds (security/performance balance)
- Salt automatically generated
- One-way hashing (passwords cannot be recovered)

**Password Requirements**:
- Currently: No enforced complexity (can be enhanced)
- Stored as hash in database
- Never transmitted or logged in plain text

### Login Logging

All login attempts are logged in the `LoginLog` table:

**Logged Information**:
- User ID
- IP address
- User agent (browser/device)
- Success/failure status
- Timestamp

**Use Cases**:
- Security auditing
- Suspicious activity detection
- User activity tracking
- Failed login monitoring

## User Roles

The platform defines 15 predefined roles covering all organizational functions:

### Administrative Roles

#### DIRECTEUR_SCIENTIFIQUE (Scientific Director)
**Responsibilities**:
- Overall scientific oversight
- Research strategy and planning
- Publication approval
- Scientific data validation

**Access Level**: Full access to all modules
**Special Permissions**: Publication approval, data validation

#### DIRECTEUR_ADMINISTRATIF_FINANCIER (Administrative & Financial Director)
**Responsibilities**:
- Financial management
- Budget approval
- Administrative oversight
- HR management

**Access Level**: Full access to administrative modules
**Special Permissions**: Budget approval, financial reports

### Scientific Roles

#### BOTANISTE (Botanist)
**Responsibilities**:
- Flora cataloging and research
- Plant species identification
- Botanical field work
- Flora data management

**Access Level**: Full access to Species module (flora), Missions, Documents
**Special Permissions**: Create/edit flora species, validate observations

#### ZOOLOGISTE_TERRESTRE (Terrestrial Zoologist)
**Responsibilities**:
- Terrestrial fauna research
- Animal species identification
- Field observations
- Fauna data management

**Access Level**: Full access to Species module (terrestrial fauna), Missions, Documents
**Special Permissions**: Create/edit terrestrial fauna species

#### BIOLOGISTE_MARIN (Marine Biologist)
**Responsibilities**:
- Marine species research
- Marine ecosystem studies
- Underwater observations
- Marine data management

**Access Level**: Full access to Species module (marine), Missions, Documents
**Special Permissions**: Create/edit marine species, access marine data

#### HYDROBIOLOGISTE (Hydrobiologist)
**Responsibilities**:
- Freshwater ecosystem research
- Water quality analysis
- Aquatic species studies
- Hydrobiological data management

**Access Level**: Full access to Species module (freshwater), Environmental Data (water), Missions
**Special Permissions**: Water quality data entry and analysis

#### GEOLOGUE (Geologist)
**Responsibilities**:
- Geological research
- Soil analysis
- Geological data collection
- Geology data management

**Access Level**: Full access to Environmental Data (geology), Missions, Documents
**Special Permissions**: Geology data entry and validation

#### CLIMATOLOGUE (Climatologist)
**Responsibilities**:
- Climate data analysis
- Weather pattern studies
- Climate research
- Climate data management

**Access Level**: Full access to Environmental Data (climate), Missions, Documents
**Special Permissions**: Climate data entry and analysis

### Technical Roles

#### DATA_SCIENTIST_SIG (Data Scientist / GIS)
**Responsibilities**:
- GIS data management
- Spatial analysis
- Data visualization
- Map layer management
- Data analytics

**Access Level**: Full access to GIS, Analytics, all data modules
**Special Permissions**: Map layer creation, advanced analytics, data export

#### INGENIEUR_PLATEFORMES (Platform Engineer)
**Responsibilities**:
- System maintenance
- Technical support
- Platform administration
- Infrastructure management

**Access Level**: Technical modules, system configuration
**Special Permissions**: System settings, technical configurations

#### TECHNICIEN_LABORATOIRE (Laboratory Technician)
**Responsibilities**:
- Laboratory operations
- Sample analysis
- Equipment maintenance
- Lab data entry

**Access Level**: Equipment (lab), Environmental Data, Documents
**Special Permissions**: Lab equipment management, sample data entry

#### TECHNICIEN_TERRAIN (Field Technician)
**Responsibilities**:
- Field data collection
- Equipment operation
- Mission support
- Field observations

**Access Level**: Missions, Equipment, Species (observations), Environmental Data
**Special Permissions**: Field data entry, equipment operation

### Operational Roles

#### MARIN_PILOTE_BATEAU (Boat Pilot / Marine)
**Responsibilities**:
- Boat operation
- Marine missions
- Marine equipment
- Safety operations

**Access Level**: Missions (marine), Equipment (boats), Documents
**Special Permissions**: Marine mission management, boat equipment

#### LOGISTICIEN (Logistician)
**Responsibilities**:
- Equipment logistics
- Mission preparation
- Inventory management
- Supply chain

**Access Level**: Equipment, Missions, Documents
**Special Permissions**: Equipment assignment, logistics planning

#### COMMUNICATION_EDITION (Communication / Editing)
**Responsibilities**:
- Publication editing
- Content creation
- Communication materials
- Document formatting

**Access Level**: Publications, Documents, limited data viewing
**Special Permissions**: Publication editing, content creation

## Permission System

### Permission Levels

The platform uses a granular permission system with 5 permission levels:

#### READ
- View data and records
- Read-only access
- Cannot modify or delete

#### WRITE
- Create new records
- Edit existing records (owned or permitted)
- Cannot delete or validate

#### VALIDATE
- Approve or validate data
- Quality control
- Data verification
- Typically for scientific validation

#### DELETE
- Remove records
- Archive data
- Requires careful consideration

#### ADMIN
- Full administrative access
- All permissions
- System configuration
- User management

### Permission Assignment

**By Role**: Default permissions assigned based on role

**By Module**: Permissions can be customized per module:
- Users
- HR
- Finance
- Equipment
- Missions
- Species
- Environmental Data
- GIS
- Documents
- Publications

**By User**: Individual users can have custom permissions via `UserPermission` table

### Permission Checking

**Server-Side**:
```typescript
import { requireAuth, requireAdmin } from "@/lib/permissions"

// Check authentication
const session = await requireAuth()

// Check admin role
const adminSession = await requireAdmin()

// Check resource access
const canAccess = await canAccessResource(resourceOwnerId)
```

**Client-Side**:
- Session data available in components
- Role-based UI rendering
- Conditional feature display

## Security Features

### Authentication Security

1. **Password Hashing**: bcrypt with 10 rounds
2. **Session Security**: HTTP-only cookies, secure flag
3. **CSRF Protection**: NextAuth.js built-in protection
4. **Login Logging**: All attempts logged
5. **Account Status**: Inactive accounts cannot login

### Authorization Security

1. **Route Protection**: All API routes validate session
2. **Page Protection**: Server components check authentication
3. **Role-Based Access**: UI and functionality based on role
4. **Permission Checks**: Granular permissions per module
5. **Resource Ownership**: Users can access their own resources

### Data Security

1. **Input Validation**: Zod schemas validate all inputs
2. **SQL Injection Prevention**: Prisma parameterized queries
3. **XSS Prevention**: React automatic escaping
4. **Audit Logging**: All critical actions logged

## Default Credentials

After database seeding:

**Admin Account**:
- Email: `admin@research-platform.ma`
- Password: `admin123`
- Role: `DIRECTEUR_SCIENTIFIQUE`

⚠️ **Security Warning**: Change default password immediately in production!

## Session Configuration

### NextAuth Configuration

**Location**: `src/lib/auth.ts`

**Key Settings**:
- Provider: Credentials (email/password)
- Session strategy: JWT
- Pages: Custom login page (`/auth/login`)
- Secret: From `NEXTAUTH_SECRET` environment variable

### Environment Variables

Required in `.env`:
```env
NEXTAUTH_URL="http://localhost:3000"  # Development URL
NEXTAUTH_SECRET="your-secret-key"      # Generate with: openssl rand -base64 32
```

## Role-Based Dashboards

The platform supports role-based dashboard customization:

**Implemented Roles**:
- DIRECTEUR_SCIENTIFIQUE
- DIRECTEUR_ADMINISTRATIF_FINANCIER
- BOTANISTE
- ZOOLOGISTE_TERRESTRE
- BIOLOGISTE_MARIN
- DATA_SCIENTIST_SIG
- TECHNICIEN_TERRAIN

**Dashboard Customization**:
- Role-specific KPIs
- Relevant data visualizations
- Quick access to role-specific features
- Customized activity feeds

**Implementation**: `src/components/dashboard/role-dashboard.tsx`

## Admin Functions

### Admin Role Detection

**Function**: `isAdminRole(role: string)`

**Admin Roles**:
- `DIRECTEUR_SCIENTIFIQUE`
- `DIRECTEUR_ADMINISTRATIF_FINANCIER`

**Admin Capabilities**:
- User management (create, edit, delete)
- System configuration
- Full data access
- Permission management
- Audit log access

### Admin Utilities

**Location**: `src/lib/permissions.ts`

**Functions**:
- `isAdmin()`: Check if current user is admin
- `requireAdmin()`: Require admin access (throws if not admin)
- `canAccessResource()`: Check resource access
- `requireAuth()`: Require authentication

## Audit and Logging

### Login Logs

**Table**: `LoginLog`

**Tracked Information**:
- User ID
- IP address
- User agent
- Success/failure
- Timestamp

**Use Cases**:
- Security monitoring
- Failed login detection
- User activity tracking

### Audit Logs

**Table**: `AuditLog`

**Tracked Actions**:
- CREATE, UPDATE, DELETE operations
- Entity type and ID
- User who performed action
- Changes made (JSON)
- IP address and user agent
- Timestamp

**Coverage**: All critical operations across all modules

## Best Practices

### For Developers

1. **Always check authentication** before accessing protected resources
2. **Use permission utilities** from `@/lib/permissions`
3. **Validate user permissions** on both client and server
4. **Log security-relevant actions** in AuditLog
5. **Never trust client-side** permission checks alone

### For Administrators

1. **Regularly review login logs** for suspicious activity
2. **Monitor audit logs** for unauthorized actions
3. **Keep roles and permissions** up to date
4. **Deactivate unused accounts** promptly
5. **Use strong passwords** and encourage users to do the same

### For Users

1. **Use strong, unique passwords**
2. **Never share credentials**
3. **Log out** when finished
4. **Report suspicious activity** immediately
5. **Keep contact information** up to date

## Future Enhancements

### Planned Features

1. **Two-Factor Authentication (2FA)**: Additional security layer
2. **Password Complexity Requirements**: Enforced password rules
3. **Session Management UI**: Users can view/revoke sessions
4. **Role Templates**: Pre-configured permission sets
5. **OAuth Integration**: Social login options
6. **LDAP/Active Directory**: Enterprise authentication
7. **API Key Authentication**: For programmatic access

### Security Improvements

1. **Rate Limiting**: Prevent brute force attacks
2. **Account Lockout**: After failed login attempts
3. **Password Expiration**: Periodic password changes
4. **Security Notifications**: Email alerts for security events
5. **IP Whitelisting**: Restrict access by IP (optional)

---

*The authentication and role system provides a secure, flexible foundation for access control while maintaining ease of use for end users.*
