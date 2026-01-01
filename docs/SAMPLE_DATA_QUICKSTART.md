# Sample Data Quick Start Guide

This guide helps you quickly understand and use the production-grade sample data system.

## 🚀 Quick Start

### 1. Generate Sample Data

```bash
# Seed the database with comprehensive sample data
npm run db:seed
```

This will generate:
- ✅ 45 users with realistic profiles
- ✅ 35 employees with HR data
- ✅ 150 cataloged species
- ✅ 600-1200 species observations
- ✅ 120 missions over the last year
- ✅ 75 equipment items
- ✅ 180 expenses over the last year
- ✅ 1500 climate data records
- ✅ Activity logs (logins, audits)

### 2. Verify Data

```bash
# Open Prisma Studio to browse data
npm run db:studio
```

Or query in your code:
```typescript
const totalMissions = await prisma.mission.count();
console.log(`Total missions: ${totalMissions}`); // Should be ~120
```

### 3. Use in Dashboard

The data is immediately ready for your dashboard components. See [DATA_MODEL.md](./DATA_MODEL.md) for detailed query examples.

## 📊 Data Characteristics

### ✅ What Makes This Data Production-Grade?

1. **Realistic Distributions**
   - Not uniform random—uses weighted selections
   - Real-world patterns (e.g., more missions in spring/summer)
   - Proper bell curves for quantities

2. **Time-Series Patterns**
   - Daily: Peak hours 9 AM - 5 PM
   - Weekly: More activity on weekdays
   - Monthly: Budget cycles, salary payments
   - Seasonal: Climate patterns, field seasons

3. **Business Logic**
   - Employee salaries match contract types
   - Mission dates are logical
   - Equipment status makes sense
   - Relationships are coherent

4. **Edge Cases**
   - 15% inactive users
   - 10% cancelled missions
   - 5% failed logins
   - Missing values where appropriate

5. **Geographic Accuracy**
   - All locations are realistic Moroccan research sites
   - Coordinates within Morocco bounds
   - Station names are meaningful

## 🎯 Common Use Cases

### Get Dashboard KPIs

```typescript
// Total users (active)
const activeUsers = await prisma.user.count({
  where: { isActive: true }
});

// Total missions
const totalMissions = await prisma.mission.count();

// Equipment utilization
const inUse = await prisma.equipment.count({
  where: { status: 'IN_USE' }
});
const total = await prisma.equipment.count();
const utilization = (inUse / total) * 100;
```

### Time-Series Charts

```typescript
// Missions by month (last 6 months)
const sixMonthsAgo = addMonths(new Date(), -6);
const missions = await prisma.mission.findMany({
  where: { createdAt: { gte: sixMonthsAgo } },
  select: { createdAt: true },
  orderBy: { createdAt: 'asc' }
});

// Group by month
const missionsByMonth = groupBy(missions, mission => {
  const date = new Date(mission.createdAt);
  return `${date.getMonth() + 1}/${date.getFullYear()}`;
});
```

### Segmented Data (Pie Charts)

```typescript
// Species by type
const speciesByType = await prisma.species.groupBy({
  by: ['type'],
  _count: { type: true }
});

// Equipment by status
const equipmentByStatus = await prisma.equipment.groupBy({
  by: ['status'],
  _count: { status: true }
});
```

### Filter by Date Range

```typescript
import { addDays, addMonths } from '@/lib/data-generators';

// Last 30 days
const last30Days = addDays(new Date(), -30);

// Last 90 days
const last90Days = addDays(new Date(), -90);

// Last 365 days
const lastYear = addDays(new Date(), -365);

// Expenses in last 30 days
const recentExpenses = await prisma.expense.findMany({
  where: {
    date: { gte: last30Days }
  },
  orderBy: { date: 'desc' }
});
```

## 📈 Data Volume

Current generation settings create:
- **Users**: 45
- **Missions**: 120 (over last year)
- **Species**: 150
- **Observations**: ~900 (2-8 per species)
- **Equipment**: 75
- **Expenses**: 180 (over last year)
- **Climate Data**: 1500 records
- **Login Logs**: ~1350 (30 per user over 90 days)

To adjust volumes, edit `prisma/seed.ts`:
```typescript
// Change user count
const userData = generateUsers(45, startDate); // ← Change 45

// Change mission count
const missionData = generateMissions(120, ...); // ← Change 120
```

## 🔍 Data Patterns Explained

### Mission Timing
- **Peak Season**: March-September (70% of missions)
- **Off Season**: October-February (30% of missions)
- **Duration**: Most missions are 3-7 days (weighted distribution)

### User Activity
- **Weekdays**: 70% of logins
- **Weekends**: 30% of logins
- **Peak Hours**: 9 AM - 5 PM (work hours)
- **Success Rate**: 95% successful, 5% failed

### Climate Data
- **Seasonal Temperature**: Higher in summer (June-Aug), lower in winter
- **Precipitation**: Higher in winter months (Nov-Mar)
- **Stations**: 5 monitoring stations across Morocco

### Equipment Lifecycle
- **Purchase Dates**: Spread over last 8 years
- **Aging**: Older equipment more likely to need maintenance
- **Status**: 50% available, 25% in use, 20% maintenance, 5% retired

## 🛠️ Customization

### Add More Data Types

1. Create a generator function in `src/lib/data-generators.ts`:
```typescript
export function generateMyData(count: number) {
  // Your generation logic
}
```

2. Use it in `prisma/seed.ts`:
```typescript
const myData = generateMyData(100);
await prisma.myModel.createMany({ data: myData });
```

### Adjust Distributions

Modify weights in generator functions:
```typescript
// Example: More cancelled missions
const statusWeights = [70, 10, 15, 5]; // was [85, 10, 5, 0]
```

### Change Time Ranges

```typescript
// Generate data for last 2 years instead of 1
const missionStartDate = addDays(new Date(), -730); // 2 years
```

## 📚 File Structure

```
src/lib/
  ├── data-models.ts       # TypeScript type definitions
  ├── data-generators.ts   # Realistic data generation functions
prisma/
  └── seed.ts             # Main seeding script
docs/
  ├── DATA_MODEL.md       # Comprehensive documentation
  └── SAMPLE_DATA_QUICKSTART.md  # This file
```

## 🐛 Troubleshooting

### Seed fails with foreign key errors
- Make sure you're deleting in the correct order (seed.ts handles this)
- Check that relationships are created before dependent entities

### Not enough data
- Increase counts in seed.ts
- Extend time ranges (e.g., last 2 years instead of 1)

### Data looks too random
- Check that you're using weightedChoice instead of randomChoice
- Verify seasonal patterns are being applied

### Missing relationships
- Ensure parent entities are created before children
- Check that IDs are properly linked

## ✅ Next Steps

1. **Explore the data**: Use Prisma Studio or your dashboard
2. **Build charts**: Use the query patterns above
3. **Customize**: Adjust volumes and patterns as needed
4. **Read the full docs**: See [DATA_MODEL.md](./DATA_MODEL.md) for details

---

**Happy dashboard building!** 🎉

