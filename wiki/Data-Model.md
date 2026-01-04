# Data Model

## Overview

The Research Platform uses a comprehensive relational database schema built with Prisma ORM. The schema consists of 30+ models covering all aspects of research center operations, from user management to scientific data collection.

## Database Technology

- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.19.0
- **Geospatial Extension**: PostGIS (for geographic data)
- **Schema Location**: `prisma/schema.prisma`

## Entity Relationship Overview

The database schema is organized into logical domains:

1. **User Management & Sessions**
2. **Human Resources**
3. **Finance & Accounting**
4. **Equipment & Logistics**
5. **Missions & Field Campaigns**
6. **Scientific Database (Species)**
7. **Environmental Data**
8. **GIS & Cartography**
9. **Document Management**
10. **Publication & Editing**
11. **Audit & Security**
12. **Notifications**

## Core Entities

### User Management & Sessions

#### User
**Purpose**: User accounts and authentication

**Key Fields**:
- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `firstName`, `lastName`: User name
- `role`: UserRole enum (15 predefined roles)
- `isActive`: Account status

**Relationships**:
- One-to-many: `sessions`, `loginLogs`, `permissions`
- One-to-one: `employee` (optional)
- One-to-many: `createdMissions`, `missionTeams`, `documents`, `auditLogs`, `notifications`

**Indexes**:
- `email` (unique)
- Implicit indexes on foreign keys

#### Session
**Purpose**: Active user sessions (JWT-based)

**Key Fields**:
- `id`: Unique identifier
- `sessionToken`: Unique session token
- `userId`: Foreign key to User
- `expires`: Session expiration date

**Relationships**:
- Many-to-one: `user`

#### LoginLog
**Purpose**: Login attempt history for security auditing

**Key Fields**:
- `id`: Unique identifier
- `userId`: Foreign key to User
- `ipAddress`: Client IP address
- `userAgent`: Browser user agent
- `success`: Login success status
- `timestamp`: Login attempt time

**Indexes**:
- `userId`
- `timestamp`

#### UserPermission
**Purpose**: Granular permissions per module

**Key Fields**:
- `id`: Unique identifier
- `userId`: Foreign key to User
- `module`: Module name (string)
- `permission`: Permission enum (READ, WRITE, VALIDATE, DELETE, ADMIN)

**Constraints**:
- Unique on `[userId, module, permission]`

---

### Human Resources

#### Employee
**Purpose**: Employee records and HR management

**Key Fields**:
- `id`: Unique identifier
- `userId`: Optional foreign key to User (linked account)
- `employeeNumber`: Unique employee number
- `hireDate`: Employment start date
- `contractType`: Contract type (CDI, CDD, Stage, etc.)
- `contractStart`, `contractEnd`: Contract dates
- `baseSalary`: Base salary (Decimal)
- `isActive`: Employment status

**Relationships**:
- One-to-one: `user` (optional)
- One-to-many: `salaries`, `bonuses`, `leaves`, `evaluations`, `missionAssignments`

#### Salary
**Purpose**: Monthly salary payments

**Key Fields**:
- `id`: Unique identifier
- `employeeId`: Foreign key to Employee
- `amount`: Salary amount (Decimal)
- `month`, `year`: Payment period
- `paidAt`: Payment date (optional)

**Constraints**:
- Unique on `[employeeId, month, year]`

#### Bonus
**Purpose**: Additional compensation (terrain, mer, risques)

**Key Fields**:
- `id`: Unique identifier
- `employeeId`: Foreign key to Employee
- `type`: Bonus type (terrain, mer, risques)
- `amount`: Bonus amount (Decimal)
- `month`, `year`: Payment period
- `reason`: Optional reason

#### Leave
**Purpose**: Leave requests and management

**Key Fields**:
- `id`: Unique identifier
- `employeeId`: Foreign key to Employee
- `type`: Leave type (congé, maladie, etc.)
- `startDate`, `endDate`: Leave period
- `status`: Approval status (pending, approved, rejected)
- `reason`: Optional reason

#### Evaluation
**Purpose**: Employee performance evaluations

**Key Fields**:
- `id`: Unique identifier
- `employeeId`: Foreign key to Employee
- `evaluatorId`: Evaluator user ID
- `period`: Evaluation period (Q1, Q2, Q3, Q4, Annual)
- `year`: Evaluation year
- `score`: Performance score (1-10, optional)
- `comments`: Evaluation comments

---

### Finance & Accounting

#### Budget
**Purpose**: Annual budget planning

**Key Fields**:
- `id`: Unique identifier
- `year`: Budget year (unique)
- `totalAmount`: Total budget (Decimal)
- `description`: Optional description

**Relationships**:
- One-to-many: `allocations`, `expenses`

#### BudgetAllocation
**Purpose**: Budget category allocations

**Key Fields**:
- `id`: Unique identifier
- `budgetId`: Foreign key to Budget
- `category`: Allocation category
- `amount`: Allocated amount (Decimal)
- `description`: Optional description

#### Grant
**Purpose**: Research grants and funding

**Key Fields**:
- `id`: Unique identifier
- `name`: Grant name
- `provider`: Grant provider
- `amount`: Grant amount (Decimal)
- `startDate`, `endDate`: Grant period
- `status`: Grant status (active, completed, cancelled)

**Relationships**:
- One-to-many: `expenses`

#### Expense
**Purpose**: Financial expense tracking

**Key Fields**:
- `id`: Unique identifier
- `budgetId`: Optional foreign key to Budget
- `grantId`: Optional foreign key to Grant
- `projectId`: Optional foreign key to Project
- `category`: Expense category
- `amount`: Expense amount (Decimal)
- `description`: Expense description
- `date`: Expense date
- `invoiceId`: Optional foreign key to Invoice

**Relationships**:
- Many-to-one: `budget`, `grant`, `project`, `invoice`

**Indexes**:
- `budgetId`, `grantId`, `projectId`, `date`

#### Invoice
**Purpose**: Supplier invoice management

**Key Fields**:
- `id`: Unique identifier
- `number`: Unique invoice number
- `supplierId`: Optional foreign key to Supplier
- `amount`: Invoice amount (Decimal)
- `date`: Invoice date
- `dueDate`: Payment due date
- `status`: Payment status (pending, paid, overdue)
- `fileUrl`: Optional file URL

**Relationships**:
- Many-to-one: `supplier`
- One-to-many: `expenses`, `payments`

#### Payment
**Purpose**: Invoice payment records

**Key Fields**:
- `id`: Unique identifier
- `invoiceId`: Foreign key to Invoice
- `amount`: Payment amount (Decimal)
- `date`: Payment date
- `method`: Payment method (bank transfer, check, cash)
- `reference`: Optional payment reference

#### Supplier
**Purpose**: Supplier/vendor information

**Key Fields**:
- `id`: Unique identifier
- `name`: Supplier name
- `contact`: Contact person
- `email`, `phone`: Contact information
- `address`: Physical address

**Relationships**:
- One-to-many: `invoices`

#### Project
**Purpose**: Research projects

**Key Fields**:
- `id`: Unique identifier
- `name`: Project name
- `description`: Project description
- `startDate`, `endDate`: Project period
- `status`: Project status (active, completed, cancelled)
- `budget`: Project budget (Decimal, optional)

**Relationships**:
- One-to-many: `expenses`

---

### Equipment & Logistics

#### Equipment
**Purpose**: Equipment inventory management

**Key Fields**:
- `id`: Unique identifier
- `name`: Equipment name
- `category`: EquipmentCategory enum (VEHICULE, BATEAU, EQUIPEMENT_SCIENTIFIQUE, INFORMATIQUE, CAMPING_TERRAIN, LABORATOIRE)
- `serialNumber`: Optional unique serial number
- `purchaseDate`: Purchase date (optional)
- `purchasePrice`: Purchase price (Decimal, optional)
- `lifespan`: Expected lifespan in years (optional)
- `status`: EquipmentStatus enum (AVAILABLE, IN_USE, MAINTENANCE, RETIRED)
- `location`: Current location
- `description`: Optional description

**Relationships**:
- One-to-many: `maintenances`, `missionEquipment`

**Indexes**:
- `category`, `status`
- `serialNumber` (unique)

#### Maintenance
**Purpose**: Equipment maintenance records

**Key Fields**:
- `id`: Unique identifier
- `equipmentId`: Foreign key to Equipment
- `type`: Maintenance type (preventive, corrective)
- `description`: Maintenance description
- `cost`: Maintenance cost (Decimal, optional)
- `date`: Maintenance date
- `nextDueDate`: Next maintenance due date (optional)

---

### Missions & Field Campaigns

#### Mission
**Purpose**: Field research missions

**Key Fields**:
- `id`: Unique identifier
- `title`: Mission title
- `description`: Mission description
- `creatorId`: Foreign key to User (mission creator)
- `startDate`, `endDate`: Mission period
- `location`: Mission location (text)
- `latitude`, `longitude`: GPS coordinates (optional)
- `objectives`: Mission objectives
- `status`: Mission status (planned, in_progress, completed, cancelled)

**Relationships**:
- Many-to-one: `creator`
- One-to-many: `teams`, `equipment`, `documents`, `speciesObservations`
- One-to-one: `report`

**Indexes**:
- `creatorId`, `status`, `startDate`

#### MissionTeam
**Purpose**: Team member assignments

**Key Fields**:
- `id`: Unique identifier
- `missionId`: Foreign key to Mission
- `userId`: Foreign key to User
- `employeeId`: Optional foreign key to Employee
- `role`: Team member role

**Constraints**:
- Unique on `[missionId, userId]`

#### MissionEquipment
**Purpose**: Equipment assignments to missions

**Key Fields**:
- `id`: Unique identifier
- `missionId`: Foreign key to Mission
- `equipmentId`: Foreign key to Equipment
- `quantity`: Quantity assigned (default: 1)

**Constraints**:
- Unique on `[missionId, equipmentId]`

#### MissionReport
**Purpose**: Post-mission reports

**Key Fields**:
- `id`: Unique identifier
- `missionId`: Foreign key to Mission (unique, one report per mission)
- `content`: Report content (Markdown or HTML)
- `summary`: Report summary
- `findings`: Key findings
- `recommendations`: Recommendations

---

### Scientific Database - Species

#### Species
**Purpose**: Species catalog

**Key Fields**:
- `id`: Unique identifier
- `scientificName`: Scientific name
- `commonName`: Common name (optional)
- `type`: SpeciesType enum (FLORE_TERRESTRE, FAUNE_TERRESTRE, FAUNE_MARINE, ESPECE_EAU_DOUCE)
- `iucnStatus`: IUCNStatus enum (LC, NT, VU, EN, CR, EW, EX, DD, NE, optional)
- `habitat`: Habitat description
- `description`: Species description

**Relationships**:
- One-to-many: `observations`, `locations`, `photos`, `references`

**Indexes**:
- `scientificName`, `type`, `iucnStatus`

#### SpeciesObservation
**Purpose**: Field observations of species

**Key Fields**:
- `id`: Unique identifier
- `speciesId`: Foreign key to Species
- `date`: Observation date
- `location`: Location description
- `latitude`, `longitude`: GPS coordinates (optional)
- `quantity`: Observed quantity (optional)
- `notes`: Observation notes
- `observerId`: Observer user ID (optional)
- `missionId`: Optional foreign key to Mission

**Relationships**:
- Many-to-one: `species`, `mission`

**Indexes**:
- `speciesId`, `date`

#### SpeciesLocation
**Purpose**: Geographic distribution of species

**Key Fields**:
- `id`: Unique identifier
- `speciesId`: Foreign key to Species
- `latitude`, `longitude`: GPS coordinates
- `location`: Location description
- `observedAt`: Observation date
- `observerId`: Observer user ID (optional)
- `notes`: Optional notes

**Indexes**:
- `speciesId`
- Composite index on `[latitude, longitude]` for spatial queries

#### SpeciesPhoto
**Purpose**: Species photographs

**Key Fields**:
- `id`: Unique identifier
- `speciesId`: Foreign key to Species
- `url`: Photo URL
- `caption`: Photo caption (optional)
- `takenAt`: Photo date (optional)

#### SpeciesReference
**Purpose**: Scientific references for species

**Key Fields**:
- `id`: Unique identifier
- `speciesId`: Foreign key to Species
- `title`: Reference title
- `authors`: Authors (optional)
- `journal`: Journal name (optional)
- `year`: Publication year (optional)
- `url`: Reference URL (optional)

---

### Environmental Data

#### WaterQuality
**Purpose**: Water quality measurements

**Key Fields**:
- `id`: Unique identifier
- `type`: WaterType enum (MER, SOURCE, BARRAGE)
- `location`: Measurement location
- `latitude`, `longitude`: GPS coordinates (optional)
- `date`: Measurement date
- `ph`: pH value (optional)
- `temperature`: Temperature (optional)
- `dissolvedO2`: Dissolved oxygen (optional)
- `turbidity`: Turbidity (optional)
- `salinity`: Salinity (optional)
- `notes`: Optional notes

**Indexes**:
- `type`, `date`
- Composite index on `[latitude, longitude]`

#### AirQuality
**Purpose**: Air quality measurements

**Key Fields**:
- `id`: Unique identifier
- `location`: Measurement location
- `latitude`, `longitude`: GPS coordinates (optional)
- `date`: Measurement date
- `pm25`, `pm10`: Particulate matter (optional)
- `no2`: Nitrogen dioxide (optional)
- `o3`: Ozone (optional)
- `co`: Carbon monoxide (optional)
- `notes`: Optional notes

**Indexes**:
- `date`
- Composite index on `[latitude, longitude]`

#### ClimateData
**Purpose**: Climate/weather data

**Key Fields**:
- `id`: Unique identifier
- `stationId`: Weather station ID (optional)
- `location`: Station location
- `latitude`, `longitude`: GPS coordinates (optional)
- `date`: Measurement date
- `temperature`: Temperature (optional)
- `humidity`: Humidity (optional)
- `pressure`: Atmospheric pressure (optional)
- `windSpeed`: Wind speed (optional)
- `windDirection`: Wind direction (optional)
- `precipitation`: Precipitation (optional)
- `notes`: Optional notes

**Indexes**:
- `date`
- Composite index on `[latitude, longitude]`

#### GeologyData
**Purpose**: Geological and soil data

**Key Fields**:
- `id`: Unique identifier
- `location`: Sample location
- `latitude`, `longitude`: GPS coordinates (optional)
- `date`: Sample date
- `soilType`: Soil type (optional)
- `rockType`: Rock type (optional)
- `composition`: Composition (optional)
- `notes`: Optional notes

**Indexes**:
- `date`
- Composite index on `[latitude, longitude]`

#### SensorData
**Purpose**: IoT sensor readings

**Key Fields**:
- `id`: Unique identifier
- `sensorId`: Sensor identifier
- `sensorType`: Sensor type
- `location`: Sensor location (optional)
- `latitude`, `longitude`: GPS coordinates (optional)
- `timestamp`: Measurement timestamp
- `value`: Sensor value (Float)
- `unit`: Measurement unit (optional)
- `metadata`: Additional metadata (JSON, optional)

**Indexes**:
- `sensorId`, `timestamp`

---

### GIS & Cartography

#### MapLayer
**Purpose**: Map layer definitions

**Key Fields**:
- `id`: Unique identifier
- `name`: Layer name
- `type`: LayerType enum (HABITAT, SPECIES, STATION_METEO, POINT_EAU, GEOLOGIE, MISSION)
- `description`: Layer description
- `geojson`: GeoJSON data (optional, stored as string)
- `style`: Style configuration (JSON, optional)
- `isVisible`: Visibility flag

**Indexes**:
- `type`

---

### Document Management

#### Document
**Purpose**: Document records with versioning

**Key Fields**:
- `id`: Unique identifier
- `title`: Document title
- `type`: DocumentType enum (RAPPORT_SCIENTIFIQUE, RAPPORT_ADMINISTRATIF, DONNEE_BRUTE, PUBLICATION, AUTRE)
- `description`: Document description
- `fileUrl`: File URL
- `fileName`: File name
- `fileSize`: File size in bytes (optional)
- `mimeType`: MIME type (optional)
- `version`: Version number (default: 1)
- `parentId`: Parent document ID for versioning (optional)
- `authorId`: Foreign key to User (document author)
- `missionId`: Optional foreign key to Mission
- `isPublic`: Public access flag

**Relationships**:
- Many-to-one: `author`, `mission`, `parent` (for versioning)
- One-to-many: `versions` (child versions)

**Indexes**:
- `type`, `authorId`, `missionId`

---

### Publication & Editing

#### Publication
**Purpose**: Scientific publications and annual books

**Key Fields**:
- `id`: Unique identifier
- `title`: Publication title
- `year`: Publication year
- `type`: Publication type (livre_annuel, article, rapport)
- `content`: Publication content (Markdown or HTML, optional)
- `coverImage`: Cover image URL (optional)
- `isPublished`: Publication status
- `publishedAt`: Publication date (optional)

**Relationships**:
- One-to-many: `chapters`

#### PublicationChapter
**Purpose**: Publication chapters

**Key Fields**:
- `id`: Unique identifier
- `publicationId`: Foreign key to Publication
- `title`: Chapter title
- `order`: Chapter order
- `content`: Chapter content (Markdown or HTML, optional)

**Indexes**:
- `publicationId`

---

### Audit & Security

#### AuditLog
**Purpose**: Audit trail for all critical actions

**Key Fields**:
- `id`: Unique identifier
- `userId`: Foreign key to User (optional, for system actions)
- `action`: Action type (CREATE, UPDATE, DELETE, etc.)
- `entity`: Entity type (Mission, Species, etc.)
- `entityId`: Entity identifier (optional)
- `changes`: Change details (JSON, optional)
- `ipAddress`: Client IP address (optional)
- `userAgent`: Browser user agent (optional)
- `timestamp`: Action timestamp

**Indexes**:
- `userId`
- Composite index on `[entity, entityId]`
- `timestamp`

---

### Notifications

#### Notification
**Purpose**: User notifications

**Key Fields**:
- `id`: Unique identifier
- `userId`: Foreign key to User
- `type`: Notification type (success, error, info, warning)
- `title`: Notification title
- `message`: Notification message (optional)
- `link`: Optional link URL
- `read`: Read status (default: false)
- `readAt`: Read timestamp (optional)
- `createdAt`: Creation timestamp

**Relationships**:
- Many-to-one: `user`

**Indexes**:
- `userId`, `read`, `createdAt`

---

## Enumerations

### UserRole
15 predefined roles:
- `DIRECTEUR_SCIENTIFIQUE`
- `DIRECTEUR_ADMINISTRATIF_FINANCIER`
- `BOTANISTE`
- `ZOOLOGISTE_TERRESTRE`
- `BIOLOGISTE_MARIN`
- `HYDROBIOLOGISTE`
- `GEOLOGUE`
- `CLIMATOLOGUE`
- `DATA_SCIENTIST_SIG`
- `INGENIEUR_PLATEFORMES`
- `TECHNICIEN_LABORATOIRE`
- `TECHNICIEN_TERRAIN`
- `MARIN_PILOTE_BATEAU`
- `LOGISTICIEN`
- `COMMUNICATION_EDITION`

### Permission
- `READ`
- `WRITE`
- `VALIDATE`
- `DELETE`
- `ADMIN`

### EquipmentCategory
- `VEHICULE`
- `BATEAU`
- `EQUIPEMENT_SCIENTIFIQUE`
- `INFORMATIQUE`
- `CAMPING_TERRAIN`
- `LABORATOIRE`

### EquipmentStatus
- `AVAILABLE`
- `IN_USE`
- `MAINTENANCE`
- `RETIRED`

### SpeciesType
- `FLORE_TERRESTRE`
- `FAUNE_TERRESTRE`
- `FAUNE_MARINE`
- `ESPECE_EAU_DOUCE`

### IUCNStatus
- `LC` (Least Concern)
- `NT` (Near Threatened)
- `VU` (Vulnerable)
- `EN` (Endangered)
- `CR` (Critically Endangered)
- `EW` (Extinct in the Wild)
- `EX` (Extinct)
- `DD` (Data Deficient)
- `NE` (Not Evaluated)

### WaterType
- `MER`
- `SOURCE`
- `BARRAGE`

### LayerType
- `HABITAT`
- `SPECIES`
- `STATION_METEO`
- `POINT_EAU`
- `GEOLOGIE`
- `MISSION`

### DocumentType
- `RAPPORT_SCIENTIFIQUE`
- `RAPPORT_ADMINISTRATIF`
- `DONNEE_BRUTE`
- `PUBLICATION`
- `AUTRE`

---

## Geospatial Data

### PostGIS Integration

The schema is designed to support PostGIS for geospatial queries, though full integration is pending:

- **Coordinates**: `latitude` and `longitude` fields stored as `Float`
- **Future Enhancement**: Convert to PostGIS `Point` geometry type
- **Spatial Indexes**: Composite indexes on `[latitude, longitude]` for efficient queries
- **Use Cases**: Species locations, mission locations, monitoring stations, sensor locations

### Current Geographic Data

All location-based entities include:
- `latitude`: Float (optional)
- `longitude`: Float (optional)
- `location`: String (text description)

**Entities with Geographic Data**:
- Mission
- SpeciesObservation
- SpeciesLocation
- WaterQuality
- AirQuality
- ClimateData
- GeologyData
- SensorData

---

## Data Relationships Summary

### One-to-Many Relationships
- User → Sessions, LoginLogs, Permissions, Missions (creator), Documents, AuditLogs, Notifications
- Employee → Salaries, Bonuses, Leaves, Evaluations, MissionAssignments
- Budget → Allocations, Expenses
- Grant → Expenses
- Project → Expenses
- Equipment → Maintenances, MissionEquipment
- Mission → Teams, Equipment, Documents, SpeciesObservations, Report
- Species → Observations, Locations, Photos, References
- Publication → Chapters
- Supplier → Invoices
- Invoice → Expenses, Payments

### One-to-One Relationships
- User ↔ Employee (optional)
- Mission ↔ MissionReport

### Many-to-Many Relationships
- Mission ↔ User (via MissionTeam)
- Mission ↔ Equipment (via MissionEquipment)

---

## Indexes and Performance

### Primary Indexes
- All models have `id` as primary key (CUID)

### Unique Constraints
- User.email
- Employee.employeeNumber
- Equipment.serialNumber
- Budget.year
- Invoice.number
- MissionTeam: `[missionId, userId]`
- MissionEquipment: `[missionId, equipmentId]`
- UserPermission: `[userId, module, permission]`
- Salary: `[employeeId, month, year]`

### Performance Indexes
- Foreign keys (automatic)
- Frequently queried fields (status, dates, categories)
- Composite indexes for spatial queries (`[latitude, longitude]`)
- Time-based indexes (`timestamp`, `date`, `createdAt`)

---

## Data Types

### Identifiers
- **CUID**: Used for all primary keys (Prisma default)
- **String**: For unique identifiers like email, employeeNumber

### Numeric Types
- **Decimal**: For monetary values (salaries, expenses, budgets) - `@db.Decimal(10, 2)` or `@db.Decimal(12, 2)`
- **Float**: For measurements (coordinates, sensor values, environmental data)
- **Int**: For counts, years, months, quantities

### Text Types
- **String**: For names, descriptions, text fields
- **String?**: Optional text fields

### Date/Time Types
- **DateTime**: For timestamps, dates
- **DateTime?**: Optional dates

### Boolean Types
- **Boolean**: For flags (isActive, isPublic, read, etc.)

### JSON Types
- **String?**: Stored as JSON string (for metadata, style configurations)

---

## Migration and Schema Management

### Prisma Migrations
- Schema defined in `prisma/schema.prisma`
- Migrations generated with `prisma migrate dev`
- Schema pushed directly with `prisma db push` (development)
- Migration history tracked in `prisma/migrations/`

### Seeding
- Seed script: `prisma/seed.ts`
- Generates realistic sample data
- Run with: `npm run db:seed`

---

*This data model provides a comprehensive foundation for all research center operations, with clear relationships, proper indexing, and support for future enhancements like PostGIS integration.*
