# PowerShell script to create comprehensive GitHub issues for Research Platform
# This script creates all necessary issues for project tracking
# Equivalent of scripts/create-comprehensive-tasks.ts for Windows/PowerShell users

$ErrorActionPreference = "Stop"

Write-Host "🚀 Creating comprehensive task list for Research Platform" -ForegroundColor Green
Write-Host ""

# Check if GitHub CLI is installed
try {
    $null = gh --version
    Write-Host "✅ GitHub CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "   Please install it from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check authentication
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "   Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI is authenticated" -ForegroundColor Green
Write-Host ""

# Define tasks - v1.0 TODO items
$v1_0_todo = @(
    @{
        Title = "Error handling standardization"
        Body = @"
## Description
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
- User-friendly messages
"@
        Milestone = "v1.0 - Production Foundation"
        Labels = @("type:enhancement", "priority:high")
    },
    @{
        Title = "Backup and recovery procedures documentation"
        Body = @"
## Description
Document backup and recovery procedures for production.

## Tasks
- [ ] Document backup procedures
- [ ] Test recovery process
- [ ] Set up automated backups
- [ ] Create recovery runbook
- [ ] Test disaster recovery

## Acceptance Criteria
- Complete backup documentation
- Recovery tested and documented
"@
        Milestone = "v1.0 - Production Foundation"
        Labels = @("type:documentation", "priority:medium")
    },
    @{
        Title = "Performance benchmarking and baseline"
        Body = @"
## Description
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
- Monitoring in place
"@
        Milestone = "v1.0 - Production Foundation"
        Labels = @("type:performance", "priority:high")
    }
)

# Define tasks - v1.1 TODO items
$v1_1_todo = @(
    @{
        Title = "HTTP caching on equipment dashboard"
        Body = @"
## Description
Implement HTTP caching for equipment dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation
- [ ] Monitor cache hit rates

## Related
- Similar to finance dashboard caching (#26)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:high", "module:equipment")
    },
    @{
        Title = "HTTP caching on RH dashboard"
        Body = @"
## Description
Implement HTTP caching for HR dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:high", "module:hr")
    },
    @{
        Title = "HTTP caching on species dashboard"
        Body = @"
## Description
Implement HTTP caching for species dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:high", "module:species")
    },
    @{
        Title = "HTTP caching on environment dashboard"
        Body = @"
## Description
Implement HTTP caching for environment dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:high", "module:environment")
    },
    @{
        Title = "HTTP caching on missions dashboard"
        Body = @"
## Description
Implement HTTP caching for missions dashboard.

## Tasks
- [ ] Implement Next.js caching
- [ ] Set cache headers
- [ ] Test cache invalidation

## Related
- Similar to finance dashboard caching (#26)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:high", "module:missions")
    },
    @{
        Title = "Server-side pagination for species list"
        Body = @"
## Description
Implement server-side pagination for species catalog (150+ items).

## Tasks
- [ ] Add pagination API endpoint
- [ ] Update UI with pagination controls
- [ ] Test with large datasets
- [ ] Optimize queries

## Acceptance Criteria
- Pagination working (20-50 items/page)
- Performance improved
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:high", "module:species")
    },
    @{
        Title = "Server-side pagination for missions list"
        Body = @"
## Description
Implement server-side pagination for missions (120+ items).

## Tasks
- [ ] Add pagination API endpoint
- [ ] Update UI with pagination controls
- [ ] Test with large datasets

## Acceptance Criteria
- Pagination working (20-50 items/page)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:medium", "module:missions")
    },
    @{
        Title = "Server-side pagination for equipment list"
        Body = @"
## Description
Implement server-side pagination for equipment inventory (100+ items).

## Tasks
- [ ] Add pagination API endpoint
- [ ] Update UI with pagination controls
- [ ] Test with large datasets

## Acceptance Criteria
- Pagination working (20-50 items/page)
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:performance", "priority:medium", "module:equipment")
    },
    @{
        Title = "Export functionality for missions"
        Body = @"
## Description
Add export functionality (Excel, CSV) for missions with geodata.

## Tasks
- [ ] Excel export with mission data
- [ ] CSV export
- [ ] Include geodata in export
- [ ] Apply filters to export

## Acceptance Criteria
- Excel and CSV exports work
- Geodata included
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:feature", "priority:high", "module:missions")
    },
    @{
        Title = "Export functionality for equipment"
        Body = @"
## Description
Add export functionality (Excel, CSV) for equipment inventory.

## Tasks
- [ ] Excel export
- [ ] CSV export
- [ ] Apply filters to export
- [ ] Include maintenance history

## Acceptance Criteria
- Export works correctly
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:feature", "priority:high", "module:equipment")
    },
    @{
        Title = "Export functionality for finance reports"
        Body = @"
## Description
Add export functionality (Excel, PDF) for financial reports.

## Tasks
- [ ] Excel financial reports
- [ ] PDF financial reports
- [ ] Budget vs actual reports
- [ ] Expense reports

## Acceptance Criteria
- Reports export correctly
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:feature", "priority:high", "module:finance")
    },
    @{
        Title = "Export functionality for HR data"
        Body = @"
## Description
Add export functionality (Excel, CSV) for employee data.

## Tasks
- [ ] Excel employee export
- [ ] CSV export
- [ ] Include salary data (optional)
- [ ] Apply filters

## Acceptance Criteria
- Export works correctly
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:feature", "priority:medium", "module:hr")
    },
    @{
        Title = "Advanced filters for species"
        Body = @"
## Description
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
- Performance acceptable
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:enhancement", "priority:high", "module:species")
    },
    @{
        Title = "Advanced filters for missions"
        Body = @"
## Description
Implement advanced filtering for missions.

## Tasks
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Filter by responsible
- [ ] Filter by location
- [ ] Multi-criteria filtering

## Acceptance Criteria
- All filters working
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:enhancement", "priority:high", "module:missions")
    },
    @{
        Title = "Advanced filters for equipment"
        Body = @"
## Description
Implement advanced filtering for equipment.

## Tasks
- [ ] Filter by category
- [ ] Filter by status
- [ ] Filter by date
- [ ] Filter by maintenance status
- [ ] Multi-criteria filtering

## Acceptance Criteria
- All filters working
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:enhancement", "priority:medium", "module:equipment")
    },
    @{
        Title = "Species distribution charts"
        Body = @"
## Description
Add advanced charts for species distribution and trends.

## Tasks
- [ ] Distribution by type chart
- [ ] Distribution by IUCN status
- [ ] Trend analysis chart
- [ ] Geographic distribution heatmap

## Acceptance Criteria
- Charts render correctly
- Data accurate
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:enhancement", "priority:medium", "module:species")
    },
    @{
        Title = "Financial analytics charts"
        Body = @"
## Description
Add advanced financial analytics charts.

## Tasks
- [ ] Budget vs actual chart
- [ ] Expense trends chart
- [ ] Category breakdown pie chart
- [ ] 12-month trend analysis

## Acceptance Criteria
- Charts accurate
- Interactive
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:enhancement", "priority:medium", "module:finance")
    },
    @{
        Title = "Import functionality for species"
        Body = @"
## Description
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
- Validation prevents errors
"@
        Milestone = "v1.1 - Performance & User Experience"
        Labels = @("type:feature", "priority:medium", "module:species")
    }
)

# Define tasks - Backlog items
$backlog_tasks = @(
    @{
        Title = "Email notifications implementation"
        Body = @"
## Description
Implement email notifications for critical events.

## Tasks
- [ ] Email service integration
- [ ] Email templates
- [ ] Notification preferences
- [ ] Scheduled emails

## Related
- Depends on WebSocket notifications (#29)
"@
        Milestone = "v1.2 - Advanced Features & Integration"
        Labels = @("type:feature", "priority:medium")
    },
    @{
        Title = "Drag-and-drop file uploads"
        Body = @"
## Description
Enhance file uploads with drag-and-drop functionality.

## Tasks
- [ ] Drag-and-drop UI
- [ ] File validation
- [ ] Progress tracking
- [ ] Multiple file upload

## Acceptance Criteria
- Drag-and-drop works
- Better UX than current upload
"@
        Milestone = "v1.2 - Advanced Features & Integration"
        Labels = @("type:enhancement", "priority:low")
    },
    @{
        Title = "Enhanced Leaflet features"
        Body = @"
## Description
Add advanced Leaflet mapping features.

## Tasks
- [ ] Multiple base map layers
- [ ] Custom layer styling
- [ ] Spatial queries
- [ ] Heat maps
- [ ] Drawing tools

## Acceptance Criteria
- Advanced mapping features work
"@
        Milestone = "v1.2 - Advanced Features & Integration"
        Labels = @("type:enhancement", "priority:medium", "module:gis")
    },
    @{
        Title = "GBIF integration"
        Body = @"
## Description
Integrate with Global Biodiversity Information Facility (GBIF) API.

## Tasks
- [ ] GBIF API integration
- [ ] Data sync
- [ ] Species matching
- [ ] Data import

## Acceptance Criteria
- GBIF data accessible
- Sync working
"@
        Milestone = "v2.0 - Advanced Platform Vision"
        Labels = @("type:feature", "priority:low")
    },
    @{
        Title = "Internationalization (i18n)"
        Body = @"
## Description
Add multi-language support (French, English, Arabic).

## Tasks
- [ ] i18n setup
- [ ] Translation files
- [ ] Language switcher
- [ ] RTL support for Arabic
- [ ] Date/time localization

## Acceptance Criteria
- All languages supported
- RTL works correctly
"@
        Milestone = "v1.3 - Quality & Polish"
        Labels = @("type:feature", "priority:medium")
    },
    @{
        Title = "Accessibility improvements (WCAG 2.1 AA)"
        Body = @"
## Description
Improve accessibility to meet WCAG 2.1 AA standards.

## Tasks
- [ ] Keyboard navigation
- [ ] Screen reader optimization
- [ ] Focus management
- [ ] Color contrast improvements
- [ ] ARIA labels

## Acceptance Criteria
- WCAG 2.1 AA compliant
"@
        Milestone = "v1.3 - Quality & Polish"
        Labels = @("type:enhancement", "priority:high")
    },
    @{
        Title = "Integration tests for API routes"
        Body = @"
## Description
Create integration tests for all API routes.

## Tasks
- [ ] Test framework setup
- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test error handling
- [ ] Test data validation

## Acceptance Criteria
- All routes tested
- Good coverage
"@
        Milestone = "v1.3 - Quality & Polish"
        Labels = @("type:testing", "priority:high")
    },
    @{
        Title = "End-to-end tests (Playwright)"
        Body = @"
## Description
Create E2E tests for critical user journeys.

## Tasks
- [ ] Playwright setup
- [ ] Critical journey tests
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] CI/CD integration

## Acceptance Criteria
- Critical paths tested
- Tests reliable
"@
        Milestone = "v1.3 - Quality & Polish"
        Labels = @("type:testing", "priority:high")
    },
    @{
        Title = "Application Performance Monitoring (APM)"
        Body = @"
## Description
Set up APM for production monitoring.

## Tasks
- [ ] APM tool selection
- [ ] Integration
- [ ] Dashboard setup
- [ ] Alerting configuration

## Acceptance Criteria
- Monitoring in place
- Alerts working
"@
        Milestone = "v1.3 - Quality & Polish"
        Labels = @("type:enhancement", "priority:high")
    },
    @{
        Title = "Error tracking with Sentry"
        Body = @"
## Description
Set up Sentry for error tracking and monitoring.

## Tasks
- [ ] Sentry integration
- [ ] Error grouping
- [ ] Alert configuration
- [ ] Dashboard setup

## Acceptance Criteria
- Errors tracked
- Alerts working
"@
        Milestone = "v1.3 - Quality & Polish"
        Labels = @("type:enhancement", "priority:high")
    }
)

# Function to create a single issue
function New-GitHubIssue {
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Task
    )
    
    $title = $Task.Title
    $body = $Task.Body
    $milestone = $Task.Milestone
    $labels = $Task.Labels -join ","
    
    Write-Host "Creating: $title" -ForegroundColor White
    
    try {
        $result = gh issue create `
            --repo benmed00/research-platform `
            --title $title `
            --body $body `
            --milestone $milestone `
            --label $labels 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Created successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ❌ Failed to create" -ForegroundColor Red
            Write-Host "  Error: $result" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ❌ Exception: $_" -ForegroundColor Red
        return $false
    }
}

# Combine all tasks
$allTasks = $v1_0_todo + $v1_1_todo + $backlog_tasks

Write-Host "📋 Creating $($allTasks.Count) tasks..." -ForegroundColor Cyan
Write-Host ""

$createdCount = 0
$failedCount = 0

foreach ($task in $allTasks) {
    $result = New-GitHubIssue -Task $task
    if ($result) {
        $createdCount++
    } else {
        $failedCount++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ Created: $createdCount" -ForegroundColor Green
if ($failedCount -gt 0) {
    Write-Host "  ❌ Failed: $failedCount" -ForegroundColor Red
} else {
    Write-Host "  ❌ Failed: 0" -ForegroundColor Green
}
Write-Host ""

if ($failedCount -gt 0) {
    Write-Host "⚠️  Some issues failed to create. Check:" -ForegroundColor Yellow
    Write-Host "   1. Milestones exist in the repository" -ForegroundColor Cyan
    Write-Host "   2. Labels exist in the repository" -ForegroundColor Cyan
    Write-Host "   3. You have write permissions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Run setup-labels.ps1 first to create missing labels" -ForegroundColor Yellow
}

Write-Host "✅ Task creation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Completed features (doneFeatures) are tracked but not created as issues." -ForegroundColor Gray
Write-Host "Add them to the project board manually if needed." -ForegroundColor Gray
Write-Host ""

