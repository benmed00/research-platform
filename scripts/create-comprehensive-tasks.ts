/**
 * Script to create comprehensive tasks based on project status
 * Analyzes current implementation and creates tasks for all milestones
 */

import { execSync, execFileSync } from 'child_process';

interface Task {
  title: string;
  body: string;
  milestone: string;
  labels: string[];
  status: 'done' | 'todo' | 'backlog';
}

// Based on IMPLEMENTATION_STATUS.md - these are DONE (but we'll create validation tasks)
const doneFeatures: Task[] = [
  {
    title: '✅ Core modules implementation complete',
    body: `## Status: COMPLETE

All 10 core modules have been fully implemented:

1. ✅ User Management & Sessions
2. ✅ Human Resources
3. ✅ Finance & Accounting
4. ✅ Equipment & Logistics
5. ✅ Missions & Field Campaigns
6. ✅ Species Database
7. ✅ Environmental Data
8. ✅ GIS & Mapping (basic)
9. ✅ Document Management
10. ✅ Publications

## Validation Tasks
- [ ] Final user acceptance testing
- [ ] Performance validation
- [ ] Security validation

This is a tracking issue for completed work.`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:documentation'],
    status: 'done'
  },
  {
    title: '✅ CRUD operations complete for all entities',
    body: `## Status: COMPLETE

All entities have full CRUD operations implemented:
- Employees, Missions, Equipment, Species
- Documents, Publications
- Users, Budgets, Expenses

## Validation Needed
- [ ] End-to-end testing of all CRUD flows
- [ ] Performance testing with large datasets`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:testing'],
    status: 'done'
  },
  {
    title: '✅ Export functionality implemented',
    body: `## Status: COMPLETE

Export functionality (PDF/Excel) has been implemented for all entities.

## Next Steps
- [ ] Validate export performance with large datasets
- [ ] Add export filtering options`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:enhancement'],
    status: 'done'
  },
  {
    title: '✅ Leaflet integration complete',
    body: `## Status: COMPLETE

Basic Leaflet integration with real data has been implemented.

## Enhancements Needed
- [ ] Advanced mapping features (v1.2)
- [ ] Multiple base map layers
- [ ] Drawing tools`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['module:gis'],
    status: 'done'
  },
  {
    title: '✅ Dark mode implemented',
    body: `## Status: COMPLETE

Dark mode has been implemented with persistence.

## Enhancements (v1.3)
- [ ] Improved contrast ratios
- [ ] Better chart dark mode support`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:enhancement'],
    status: 'done'
  }
];

// TODO items for v1.0
const v1_0_todo: Task[] = [
  {
    title: 'Error handling standardization',
    body: `## Description
Standardize error handling across all API routes and components.

## Tasks
- [ ] Create error handling utilities
- [ ] Standardize error response format
- [ ] Add error logging
- [ ] User-friendly error messages
- [ ] Error boundary components

## Acceptance Criteria
- Consistent error handling everywhere
- Proper error logging
- User-friendly messages`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:enhancement', 'priority:high'],
    status: 'todo'
  },
  {
    title: 'Backup and recovery procedures documentation',
    body: `## Description
Document backup and recovery procedures for production.

## Tasks
- [ ] Document backup procedures
- [ ] Test recovery process
- [ ] Set up automated backups
- [ ] Create recovery runbook
- [ ] Test disaster recovery

## Acceptance Criteria
- Complete backup documentation
- Recovery tested and documented`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:documentation', 'priority:medium'],
    status: 'todo'
  },
  {
    title: 'Performance benchmarking and baseline',
    body: `## Description
Establish performance benchmarks and measure current baseline.

## Tasks
- [ ] Measure current page load times
- [ ] Measure API response times
- [ ] Document performance baseline
- [ ] Set performance targets
- [ ] Create performance dashboard

## Acceptance Criteria
- Baseline metrics documented
- Targets defined
- Monitoring in place`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['type:performance', 'priority:high'],
    status: 'todo'
  }
];

// TODO items for v1.1
const v1_1_todo: Task[] = [
  {
    title: 'HTTP caching on equipment dashboard',
    body: `## Description
Implement HTTP caching for equipment dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation
- [ ] Monitor cache hit rates

## Related
- Similar to finance dashboard caching (#26)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:high', 'module:equipment'],
    status: 'todo'
  },
  {
    title: 'HTTP caching on RH dashboard',
    body: `## Description
Implement HTTP caching for HR dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:high', 'module:hr'],
    status: 'todo'
  },
  {
    title: 'HTTP caching on species dashboard',
    body: `## Description
Implement HTTP caching for species dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:high', 'module:species'],
    status: 'todo'
  },
  {
    title: 'HTTP caching on environment dashboard',
    body: `## Description
Implement HTTP caching for environment dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:high', 'module:environment'],
    status: 'todo'
  },
  {
    title: 'HTTP caching on missions dashboard',
    body: `## Description
Implement HTTP caching for missions dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:high', 'module:missions'],
    status: 'todo'
  },
  {
    title: 'Server-side pagination for species list',
    body: `## Description
Implement server-side pagination for species catalog (150+ items).

## Tasks
- [ ] Add pagination API endpoint
- [ ] Update UI with pagination controls
- [ ] Test with large datasets
- [ ] Optimize queries

## Acceptance Criteria
- Pagination working (20-50 items/page)
- Performance improved`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:high', 'module:species'],
    status: 'todo'
  },
  {
    title: 'Server-side pagination for missions list',
    body: `## Description
Implement server-side pagination for missions (120+ items).

## Tasks
- [ ] Add pagination API endpoint
- [ ] Update UI with pagination controls
- [ ] Test with large datasets

## Acceptance Criteria
- Pagination working (20-50 items/page)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:medium', 'module:missions'],
    status: 'todo'
  },
  {
    title: 'Server-side pagination for equipment list',
    body: `## Description
Implement server-side pagination for equipment inventory (100+ items).

## Tasks
- [ ] Add pagination API endpoint
- [ ] Update UI with pagination controls
- [ ] Test with large datasets

## Acceptance Criteria
- Pagination working (20-50 items/page)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:performance', 'priority:medium', 'module:equipment'],
    status: 'todo'
  },
  {
    title: 'Export functionality for missions',
    body: `## Description
Add export functionality (Excel, CSV) for missions with geodata.

## Tasks
- [ ] Excel export with mission data
- [ ] CSV export
- [ ] Include geodata in export
- [ ] Apply filters to export

## Acceptance Criteria
- Excel and CSV exports work
- Geodata included`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:feature', 'priority:high', 'module:missions'],
    status: 'todo'
  },
  {
    title: 'Export functionality for equipment',
    body: `## Description
Add export functionality (Excel, CSV) for equipment inventory.

## Tasks
- [ ] Excel export
- [ ] CSV export
- [ ] Apply filters to export
- [ ] Include maintenance history

## Acceptance Criteria
- Export works correctly`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:feature', 'priority:high', 'module:equipment'],
    status: 'todo'
  },
  {
    title: 'Export functionality for finance reports',
    body: `## Description
Add export functionality (Excel, PDF) for financial reports.

## Tasks
- [ ] Excel financial reports
- [ ] PDF financial reports
- [ ] Budget vs actual reports
- [ ] Expense reports

## Acceptance Criteria
- Reports export correctly`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:feature', 'priority:high', 'module:finance'],
    status: 'todo'
  },
  {
    title: 'Export functionality for HR data',
    body: `## Description
Add export functionality (Excel, CSV) for employee data.

## Tasks
- [ ] Excel employee export
- [ ] CSV export
- [ ] Include salary data (optional)
- [ ] Apply filters

## Acceptance Criteria
- Export works correctly`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:feature', 'priority:medium', 'module:hr'],
    status: 'todo'
  },
  {
    title: 'Advanced filters for species',
    body: `## Description
Implement advanced filtering for species catalog.

## Tasks
- [ ] Filter by type (Flora/Fauna)
- [ ] Filter by IUCN status
- [ ] Filter by habitat
- [ ] Filter by date
- [ ] Multi-criteria filtering
- [ ] Saved filter presets

## Acceptance Criteria
- All filters working
- Performance acceptable`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:enhancement', 'priority:high', 'module:species'],
    status: 'todo'
  },
  {
    title: 'Advanced filters for missions',
    body: `## Description
Implement advanced filtering for missions.

## Tasks
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Filter by responsible
- [ ] Filter by location
- [ ] Multi-criteria filtering

## Acceptance Criteria
- All filters working`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:enhancement', 'priority:high', 'module:missions'],
    status: 'todo'
  },
  {
    title: 'Advanced filters for equipment',
    body: `## Description
Implement advanced filtering for equipment.

## Tasks
- [ ] Filter by category
- [ ] Filter by status
- [ ] Filter by date
- [ ] Filter by maintenance status
- [ ] Multi-criteria filtering

## Acceptance Criteria
- All filters working`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:enhancement', 'priority:medium', 'module:equipment'],
    status: 'todo'
  },
  {
    title: 'Species distribution charts',
    body: `## Description
Add advanced charts for species distribution and trends.

## Tasks
- [ ] Distribution by type chart
- [ ] Distribution by IUCN status
- [ ] Trend analysis chart
- [ ] Geographic distribution heatmap

## Acceptance Criteria
- Charts render correctly
- Data accurate`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:enhancement', 'priority:medium', 'module:species'],
    status: 'todo'
  },
  {
    title: 'Financial analytics charts',
    body: `## Description
Add advanced financial analytics charts.

## Tasks
- [ ] Budget vs actual chart
- [ ] Expense trends chart
- [ ] Category breakdown pie chart
- [ ] 12-month trend analysis

## Acceptance Criteria
- Charts accurate
- Interactive`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:enhancement', 'priority:medium', 'module:finance'],
    status: 'todo'
  },
  {
    title: 'Import functionality for species',
    body: `## Description
Add CSV/Excel import for species catalog.

## Tasks
- [ ] CSV import
- [ ] Excel import
- [ ] Data validation
- [ ] Error handling
- [ ] Preview before import
- [ ] Batch import

## Acceptance Criteria
- Import works correctly
- Validation prevents errors`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['type:feature', 'priority:medium', 'module:species'],
    status: 'todo'
  }
];

// BACKLOG items (future work)
const backlog_tasks: Task[] = [
  {
    title: 'Email notifications implementation',
    body: `## Description
Implement email notifications for critical events.

## Tasks
- [ ] Email service integration
- [ ] Email templates
- [ ] Notification preferences
- [ ] Scheduled emails

## Related
- Depends on WebSocket notifications (#29)`,
    milestone: 'v1.2 - Advanced Features & Integration',
    labels: ['type:feature', 'priority:medium'],
    status: 'backlog'
  },
  {
    title: 'Drag-and-drop file uploads',
    body: `## Description
Enhance file uploads with drag-and-drop functionality.

## Tasks
- [ ] Drag-and-drop UI
- [ ] File validation
- [ ] Progress tracking
- [ ] Multiple file upload

## Acceptance Criteria
- Drag-and-drop works
- Better UX than current upload`,
    milestone: 'v1.2 - Advanced Features & Integration',
    labels: ['type:enhancement', 'priority:low'],
    status: 'backlog'
  },
  {
    title: 'Enhanced Leaflet features',
    body: `## Description
Add advanced Leaflet mapping features.

## Tasks
- [ ] Multiple base map layers
- [ ] Custom layer styling
- [ ] Spatial queries
- [ ] Heat maps
- [ ] Drawing tools

## Acceptance Criteria
- Advanced mapping features work`,
    milestone: 'v1.2 - Advanced Features & Integration',
    labels: ['type:enhancement', 'priority:medium', 'module:gis'],
    status: 'backlog'
  },
  {
    title: 'GBIF integration',
    body: `## Description
Integrate with Global Biodiversity Information Facility (GBIF) API.

## Tasks
- [ ] GBIF API integration
- [ ] Data sync
- [ ] Species matching
- [ ] Data import

## Acceptance Criteria
- GBIF data accessible
- Sync working`,
    milestone: 'v2.0 - Advanced Platform Vision',
    labels: ['type:feature', 'priority:low'],
    status: 'backlog'
  },
  {
    title: 'Internationalization (i18n)',
    body: `## Description
Add multi-language support (French, English, Arabic).

## Tasks
- [ ] i18n setup
- [ ] Translation files
- [ ] Language switcher
- [ ] RTL support for Arabic
- [ ] Date/time localization

## Acceptance Criteria
- All languages supported
- RTL works correctly`,
    milestone: 'v1.3 - Quality & Polish',
    labels: ['type:feature', 'priority:medium'],
    status: 'backlog'
  },
  {
    title: 'Accessibility improvements (WCAG 2.1 AA)',
    body: `## Description
Improve accessibility to meet WCAG 2.1 AA standards.

## Tasks
- [ ] Keyboard navigation
- [ ] Screen reader optimization
- [ ] Focus management
- [ ] Color contrast improvements
- [ ] ARIA labels

## Acceptance Criteria
- WCAG 2.1 AA compliant`,
    milestone: 'v1.3 - Quality & Polish',
    labels: ['type:enhancement', 'priority:high'],
    status: 'backlog'
  },
  {
    title: 'Integration tests for API routes',
    body: `## Description
Create integration tests for all API routes.

## Tasks
- [ ] Test framework setup
- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test error handling
- [ ] Test data validation

## Acceptance Criteria
- All routes tested
- Good coverage`,
    milestone: 'v1.3 - Quality & Polish',
    labels: ['type:testing', 'priority:high'],
    status: 'backlog'
  },
  {
    title: 'End-to-end tests (Playwright)',
    body: `## Description
Create E2E tests for critical user journeys.

## Tasks
- [ ] Playwright setup
- [ ] Critical journey tests
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] CI/CD integration

## Acceptance Criteria
- Critical paths tested
- Tests reliable`,
    milestone: 'v1.3 - Quality & Polish',
    labels: ['type:testing', 'priority:high'],
    status: 'backlog'
  },
  {
    title: 'Application Performance Monitoring (APM)',
    body: `## Description
Set up APM for production monitoring.

## Tasks
- [ ] APM tool selection
- [ ] Integration
- [ ] Dashboard setup
- [ ] Alerting configuration

## Acceptance Criteria
- Monitoring in place
- Alerts working`,
    milestone: 'v1.3 - Quality & Polish',
    labels: ['type:enhancement', 'priority:high'],
    status: 'backlog'
  },
  {
    title: 'Error tracking with Sentry',
    body: `## Description
Set up Sentry for error tracking and monitoring.

## Tasks
- [ ] Sentry integration
- [ ] Error grouping
- [ ] Alert configuration
- [ ] Dashboard setup

## Acceptance Criteria
- Errors tracked
- Alerts working`,
    milestone: 'v1.3 - Quality & Polish',
    labels: ['type:enhancement', 'priority:high'],
    status: 'backlog'
  }
];

function createIssue(task: Task): void {
  try {
    console.log(`Creating: ${task.title}`);
    
    const labels = task.labels.join(',');
    const args = [
      'issue',
      'create',
      '--title',
      task.title,
      '--body',
      task.body,
      '--milestone',
      task.milestone,
      '--label',
      labels
    ];
    
    execFileSync('gh', args, { stdio: 'inherit', encoding: 'utf-8' });
    console.log(`✅ Created: ${task.title}\n`);
  } catch (error) {
    console.error(`❌ Failed: ${task.title}`);
    console.error(error);
  }
}

function main() {
  console.log('🚀 Creating comprehensive task list...\n');
  
  // Check gh
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ GitHub CLI (gh) is not installed');
    process.exit(1);
  }
  
  // Check auth
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Not authenticated with GitHub CLI');
    process.exit(1);
  }
  
  console.log('✅ GitHub CLI is available\n');
  
  const allTasks = [
    ...v1_0_todo,
    ...v1_1_todo,
    ...backlog_tasks
  ];
  
  console.log(`📋 Creating ${allTasks.length} tasks...\n`);
  
  allTasks.forEach(createIssue);
  
  console.log('\n✅ Task creation complete!');
  console.log('\nNote: Completed features (doneFeatures) are tracked but not created as issues.');
  console.log('Add them to the project board manually if needed.\n');
}

if (require.main === module) {
  main();
}

export { createIssue, doneFeatures, v1_0_todo, v1_1_todo, backlog_tasks };

