# Data Model & Sample Data Documentation

This document explains the comprehensive data model for the Research Platform dashboard and how the generated sample data maps to dashboard components.

## 📊 Overview

The sample data generation system creates production-grade, realistic data with:
- **Time-series patterns**: Daily, weekly, monthly trends
- **Realistic distributions**: Weighted random selections based on real-world patterns
- **Seasonal variations**: Climate data with proper seasonal cycles
- **Business logic**: Coherent relationships between entities
- **Edge cases**: Missing values, outliers, inactive users, status transitions

## 🗂️ Core Entities & Relationships

### 1. Users & Employees

**Entity**: `User` + `Employee`

**Sample Data Generated**:
- 45 users with realistic Moroccan names
- 35 employees linked to users
- Role distribution weighted toward field scientists
- 15% inactive users (realistic churn)
- Staggered creation dates over 24 months

**Dashboard Usage**:
- **KPI Cards**: Total active users, total employees
- **Line Chart**: User growth over time (monthly registration trend)
- **Pie Chart**: User distribution by role
- **Table**: Recent user activity

**Key Fields**:
```typescript
{
  email: "ahmed.alaoui@research-platform.ma",
  firstName: "Ahmed",
  lastName: "Alaoui",
  role: "BOTANISTE",
  isActive: true,
  createdAt: "2023-06-15T10:30:00Z"
}
```

### 2. Missions

**Entity**: `Mission`

**Sample Data Generated**:
- 120 missions over last 365 days
- Status distribution: 85% completed, 10% cancelled, 5% in progress (for past missions)
- Peak season bias: More missions in spring/summer (March-September)
- Duration: 1-14 days (weighted: most are 3-7 days)
- Teams: 2-5 members per mission

**Dashboard Usage**:
- **KPI Cards**: Total missions, active missions, completed missions
- **Line Chart**: Missions over time (monthly trend)
- **Bar Chart**: Missions by status
- **Map**: Mission locations (latitude/longitude)
- **Table**: Recent missions with status

**Key Patterns**:
```typescript
{
  title: "Inventaire de la biodiversité - Parc National d'Ifrane",
  status: "completed", // or "planned", "in_progress", "cancelled"
  startDate: "2024-03-15",
  endDate: "2024-03-20",
  location: "Parc National d'Ifrane",
  latitude: 33.5,
  longitude: -5.1,
  createdAt: "2024-02-28" // Created 2 weeks before mission
}
```

**Time-Series Analysis**:
- Monthly aggregation shows seasonal patterns
- Completion rate trends
- Mission duration averages

### 3. Species & Observations

**Entity**: `Species` + `SpeciesObservation`

**Sample Data Generated**:
- 150 cataloged species
- Type distribution: 30% Flora, 25% Terrestrial Fauna, 25% Marine Fauna, 20% Freshwater
- IUCN status: Weighted toward LC/NT (40%/15%), fewer endangered (5% CR)
- 2-8 observations per species over past year (600-1200 total observations)
- 50% of observations linked to completed missions

**Dashboard Usage**:
- **KPI Cards**: Total species cataloged
- **Pie Chart**: Species by type (FLORE_TERRESTRE, FAUNE_TERRESTRE, etc.)
- **Bar Chart**: Species by IUCN status
- **Line Chart**: Species discoveries over time
- **Heatmap**: Observation density by location

**Key Patterns**:
```typescript
{
  scientificName: "Quercus ilex",
  commonName: "Chêne vert",
  type: "FLORE_TERRESTRE",
  iucnStatus: "LC", // Least Concern
  habitat: "Forêt de cèdres"
}

// Observations
{
  speciesId: "...",
  date: "2024-04-10",
  latitude: 33.5,
  longitude: -5.1,
  quantity: 15,
  missionId: "..." // Optional link to mission
}
```

### 4. Equipment

**Entity**: `Equipment` + `Maintenance`

**Sample Data Generated**:
- 75 equipment items
- Category distribution: 30% Scientific, 20% IT, 20% Lab, 15% Camping, 10% Vehicles, 5% Boats
- Status distribution: 50% Available, 25% In Use, 20% Maintenance, 5% Retired
- 0-5 maintenance records per equipment
- Equipment linked to active missions (status → IN_USE)

**Dashboard Usage**:
- **KPI Cards**: Total equipment, equipment utilization rate
- **Pie Chart**: Equipment by status
- **Bar Chart**: Equipment by category
- **Table**: Equipment requiring maintenance
- **Line Chart**: Maintenance costs over time

**Key Patterns**:
```typescript
{
  name: "GPS haute précision",
  category: "EQUIPEMENT_SCIENTIFIQUE",
  status: "IN_USE", // Linked to active mission
  purchaseDate: "2022-01-15",
  purchasePrice: 25000,
  lifespan: 8,
  location: "En mission"
}
```

### 5. Financial Data

**Entities**: `Budget`, `BudgetAllocation`, `Expense`

**Sample Data Generated**:
- Budgets for last 3 years + current year + next year
- Budget allocations: 35% Research, 35% Personnel, 15% Equipment, 15% Logistics
- 180 expenses over last 365 days
- Expense categories with realistic amounts
- Time-series with monthly patterns

**Dashboard Usage**:
- **KPI Cards**: Annual budget, budget utilization, total expenses
- **Line Chart**: Expenses over time (daily/monthly)
- **Bar Chart**: Expenses by category
- **Gauge Chart**: Budget utilization percentage
- **Table**: Recent expenses

**Key Patterns**:
```typescript
{
  year: 2024,
  totalAmount: 5500000, // 5.5M MAD
  allocations: [
    { category: "Recherche", amount: 1925000 },
    { category: "Personnel", amount: 1925000 },
    // ...
  ]
}

// Expenses
{
  category: "Transport",
  amount: 2500,
  date: "2024-03-15",
  description: "Carburant - Mission Parc Ifrane"
}
```

### 6. Environmental Data

**Entities**: `ClimateData`, `AirQuality`

**Sample Data Generated**:
- 1500 climate data records (daily data for 5 stations over 365 days)
- Seasonal patterns: Temperature higher in summer, precipitation in winter
- 400 air quality records with realistic PM2.5, PM10, NO2, O3, CO values
- 5 monitoring stations across Morocco

**Dashboard Usage**:
- **Line Chart**: Temperature/humidity/precipitation over time
- **Map**: Station locations with data overlay
- **Heatmap**: Air quality by location
- **Bar Chart**: Average values by station

**Key Patterns**:
```typescript
{
  stationId: "ST001",
  location: "Station Ifrane",
  date: "2024-03-15",
  temperature: 18.5, // Seasonal variation applied
  humidity: 65.2,
  precipitation: 0,
  pressure: 1013.2
}

// Air Quality
{
  location: "Casablanca",
  date: "2024-03-15",
  pm25: 45,
  pm10: 68,
  no2: 55
}
```

### 7. Activity Logs

**Entities**: `LoginLog`, `AuditLog`

**Sample Data Generated**:
- Login logs: ~30 logins per user over last 90 days (~1350 total)
- Realistic patterns: More activity on weekdays, peak hours 9-17
- 95% successful logins (5% failures)
- 500 audit logs (CREATE, UPDATE, DELETE actions)

**Dashboard Usage**:
- **Line Chart**: User activity over time (daily active users)
- **Bar Chart**: Logins by hour of day
- **Table**: Recent login activity
- **KPI Cards**: Active users (last 7/30 days)

**Key Patterns**:
```typescript
{
  userId: "...",
  timestamp: "2024-03-15T14:30:00Z", // Weekday afternoon
  success: true,
  ipAddress: "41.143.123.45"
}

// Audit Logs
{
  userId: "...",
  action: "CREATE",
  entity: "Mission",
  entityId: "...",
  timestamp: "2024-03-15T10:15:00Z"
}
```

## 📈 Time-Series Data Patterns

### Daily Patterns
- **Login Activity**: Higher 9 AM - 5 PM, lower weekends
- **Climate Data**: Daily measurements with seasonal variations
- **Expenses**: Randomly distributed, but more on weekdays

### Weekly Patterns
- **Mission Creation**: More missions planned on Mondays/Tuesdays
- **User Activity**: Higher weekdays, 30% weekend activity

### Monthly Patterns
- **Expenses**: Steady monthly flow with occasional spikes
- **Salaries**: Paid around 25-28th of each month
- **Missions**: Peak in spring/summer (March-September)

### Seasonal Patterns
- **Climate**: Temperature peaks in summer, precipitation in winter
- **Missions**: Field season bias toward warmer months
- **Species Observations**: More in spring/summer

### Annual Patterns
- **Budget**: Year-over-year growth (~5-10%)
- **User Growth**: Staggered over 24 months with some churn
- **Equipment**: Aging curve (purchase dates spread over 8 years)

## 🎯 Dashboard Component Mapping

### Main Dashboard (`/dashboard`)

**KPI Cards**:
```typescript
- Total Users: users.filter(u => u.isActive).length
- Total Employees: employees.filter(e => e.isActive).length
- Total Equipment: equipment.length
- Total Missions: missions.length
- Total Species: species.length
- Annual Budget: budget.totalAmount
```

**Charts**:
```typescript
// Line Chart: Missions by Month
missionsByMonth: [
  { month: "Jan 2024", count: 8 },
  { month: "Feb 2024", count: 6 },
  // ... 6 months of data
]

// Pie Chart: Species by Type
speciesByType: [
  { name: "Flore Terrestre", value: 45 },
  { name: "Faune Terrestre", value: 38 },
  // ...
]

// Pie Chart: Equipment by Status
equipmentByStatus: [
  { name: "Disponible", value: 38 },
  { name: "En utilisation", value: 19 },
  // ...
]
```

### Analytics Dashboard

**Time-Series Analysis**:
```typescript
// Last 30/90/365 days aggregation
const dateRange = { days: 30 | 90 | 365 };

// Metrics
- Mission completion rate
- Average mission duration
- Species discovery rate
- Equipment utilization
- Budget burn rate
- User retention (active users)
```

**Segmentation**:
```typescript
// By User Role
usersByRole: GroupBy(users, 'role')

// By Mission Status
missionsByStatus: GroupBy(missions, 'status')

// By Expense Category
expensesByCategory: GroupBy(expenses, 'category')

// By Equipment Category
equipmentByCategory: GroupBy(equipment, 'category')
```

### Trends & Growth Metrics

**Growth Calculations**:
```typescript
// Month-over-month growth
const currentMonth = missions.filter(m => m.createdAt >= startOfMonth);
const lastMonth = missions.filter(m => m.createdAt >= startOfLastMonth);
const growth = ((currentMonth.length - lastMonth.length) / lastMonth.length) * 100;

// Year-over-year growth
// Cumulative totals over time
```

**Retention Metrics**:
```typescript
// Daily Active Users (DAU)
const dau = loginLogs
  .filter(log => log.timestamp >= today && log.success)
  .map(log => log.userId)
  .unique()
  .length;

// Monthly Active Users (MAU)
// User retention rate
```

## 🔍 Edge Cases Included

1. **Missing Values**: Some optional fields are null (e.g., `contractEnd` for CDI employees)
2. **Outliers**: Some expensive equipment items, large expense spikes
3. **Inactive Users**: 15% of users are inactive
4. **Status Transitions**: Missions transition from planned → in_progress → completed
5. **Cancelled Missions**: 10% cancellation rate
6. **Retired Equipment**: 5% of equipment is retired
7. **Failed Logins**: 5% of login attempts fail
8. **Linked Data**: Some observations linked to missions, others standalone

## 📊 Data Quality Characteristics

### Realistic Distributions
- Not uniform random: Uses weighted selection
- Bell curves for quantities
- Proper ranges for all numeric fields

### Business Logic
- Employee salaries match contract types
- Mission dates are logical (end after start)
- Equipment status transitions make sense
- Budget allocations sum to total

### Temporal Coherence
- Creation dates before update dates
- Mission creation before start dates
- Historical data precedes current data

### Geographic Consistency
- All coordinates within Morocco bounds (21-36°N, -17 to -1°W)
- Mission locations match Moroccan research sites

## 🚀 Usage Examples

### Query Time-Series Data

```typescript
// Get missions grouped by month (last 6 months)
const missionsByMonth = await prisma.mission.groupBy({
  by: ['createdAt'],
  where: {
    createdAt: { gte: sixMonthsAgo }
  },
  _count: true
});
```

### Calculate KPIs

```typescript
// Equipment utilization rate
const inUse = await prisma.equipment.count({
  where: { status: 'IN_USE' }
});
const total = await prisma.equipment.count();
const utilization = (inUse / total) * 100;
```

### Filter by Time Range

```typescript
// Last 30 days expenses
const last30Days = await prisma.expense.findMany({
  where: {
    date: {
      gte: addDays(new Date(), -30)
    }
  },
  orderBy: { date: 'desc' }
});
```

## 📝 Next Steps

To use this data in your dashboard:

1. **Run the seed script**:
   ```bash
   npm run db:seed
   ```

2. **Verify data generation**:
   - Check console output for creation counts
   - Use Prisma Studio: `npm run db:studio`

3. **Build dashboard components**:
   - Use the query patterns above
   - Implement filters for time ranges
   - Create aggregation functions

4. **Customize data volume**:
   - Adjust counts in `seed.ts`
   - Modify date ranges
   - Add more entities as needed

## 🔑 Default Credentials

After seeding:
- **Admin**: `admin@research-platform.ma` / `admin123`
- **Other users**: Any email from generated users / `password123`

---

**Note**: All generated data is realistic but fictional. Use for development and testing only.

