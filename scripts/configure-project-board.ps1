# PowerShell script to configure GitHub Project Board using GitHub CLI
# This script configures the project board, creates labels, and sets up initial structure

$ErrorActionPreference = "Stop"

Write-Host "🚀 Configuring GitHub Project Board for Research Platform" -ForegroundColor Green
Write-Host ""

# Step 1: Check and refresh authentication with project scope
Write-Host "📋 Step 1: Checking authentication..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Check if project scope is available
$hasProjectScope = $authStatus | Select-String -Pattern "project" -Quiet

if (-not $hasProjectScope) {
    Write-Host "⚠️  Project scope is required for project management." -ForegroundColor Yellow
    Write-Host "Please run the following command to add project scope:" -ForegroundColor Yellow
    Write-Host "   gh auth refresh -s project" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will open a browser for authorization." -ForegroundColor Yellow
    $response = Read-Host "Do you want to add project scope now? (y/n)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "Opening browser for authorization..." -ForegroundColor Cyan
        gh auth refresh -s project
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Project scope added successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to add project scope." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️  Skipping project configuration. Cannot proceed without project scope." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✅ Authentication verified with project scope" -ForegroundColor Green
}

Write-Host ""

# Step 2: List projects to find the Research Platform project
Write-Host "📋 Step 2: Finding Research Platform project..." -ForegroundColor Cyan
$projects = gh project list --owner benmed00 --limit 20 2>&1 | ConvertFrom-Json

if ($LASTEXITCODE -ne 0 -or -not $projects) {
    Write-Host "❌ Could not list projects. Make sure the project exists." -ForegroundColor Red
    Write-Host "Error: $projects" -ForegroundColor Red
    exit 1
}

$project = $projects | Where-Object { $_.title -like "*Research Platform*" } | Select-Object -First 1

if (-not $project) {
    Write-Host "❌ Research Platform project not found." -ForegroundColor Red
    Write-Host "Available projects:" -ForegroundColor Yellow
    $projects | ForEach-Object { Write-Host "  - $($_.title) (Number: $($_.number))" -ForegroundColor White }
    Write-Host ""
    Write-Host "Please create the project first via:" -ForegroundColor Yellow
    Write-Host "  https://github.com/benmed00/research-platform/projects/new" -ForegroundColor Cyan
    exit 1
}

$projectNumber = $project.number
$projectTitle = $project.title

Write-Host "✅ Found project: $projectTitle (Number: $projectNumber)" -ForegroundColor Green
Write-Host ""

# Step 3: Link project to repository
Write-Host "📋 Step 3: Linking project to repository..." -ForegroundColor Cyan
$linkResult = gh project link $projectNumber --owner benmed00 --repo research-platform 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Project linked to repository" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Project may already be linked or linking is not needed" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Create labels
Write-Host "📋 Step 4: Creating labels..." -ForegroundColor Cyan

$labels = @(
    @{Name="priority:high"; Description="High priority"; Color="d73a4a"},
    @{Name="priority:medium"; Description="Medium priority"; Color="fbca04"},
    @{Name="priority:low"; Description="Low priority"; Color="0e8a16"},
    @{Name="type:feature"; Description="New feature"; Color="0e8a16"},
    @{Name="type:enhancement"; Description="Enhancement"; Color="a2eeef"},
    @{Name="type:bug"; Description="Bug fix"; Color="d73a4a"},
    @{Name="type:performance"; Description="Performance improvement"; Color="0052cc"},
    @{Name="type:documentation"; Description="Documentation"; Color="d4c5f9"},
    @{Name="type:security"; Description="Security"; Color="b60205"},
    @{Name="type:testing"; Description="Testing"; Color="f9d0c4"},
    @{Name="type:refactor"; Description="Code refactoring"; Color="c5def5"},
    @{Name="module:users"; Description="User management"; Color="1d76db"},
    @{Name="module:hr"; Description="Human resources"; Color="1d76db"},
    @{Name="module:finance"; Description="Finance and accounting"; Color="1d76db"},
    @{Name="module:equipment"; Description="Equipment and logistics"; Color="1d76db"},
    @{Name="module:missions"; Description="Missions and campaigns"; Color="1d76db"},
    @{Name="module:species"; Description="Species database"; Color="1d76db"},
    @{Name="module:environment"; Description="Environmental data"; Color="1d76db"},
    @{Name="module:gis"; Description="GIS and mapping"; Color="1d76db"},
    @{Name="module:documents"; Description="Document management"; Color="1d76db"},
    @{Name="module:publications"; Description="Publications"; Color="1d76db"}
)

$createdCount = 0
$existingCount = 0

foreach ($label in $labels) {
    $labelName = $label.Name
    $labelDesc = $label.Description
    $labelColor = $label.Color
    
    # Check if label exists
    $existingLabel = gh label list --repo benmed00/research-platform --json name --jq ".[] | select(.name == `"$labelName`")" 2>&1
    
    if ($existingLabel) {
        Write-Host "  ⏭️  Label '$labelName' already exists" -ForegroundColor Yellow
        $existingCount++
    } else {
        $result = gh label create $labelName --description $labelDesc --color $labelColor --repo benmed00/research-platform 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Created label: $labelName" -ForegroundColor Green
            $createdCount++
        } else {
            Write-Host "  ❌ Failed to create label: $labelName" -ForegroundColor Red
            Write-Host "     Error: $result" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "✅ Labels: $createdCount created, $existingCount already existed" -ForegroundColor Green
Write-Host ""

# Step 5: Display project information
Write-Host "📋 Step 5: Project Configuration Summary" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Details:" -ForegroundColor White
Write-Host "  Title: $projectTitle" -ForegroundColor White
Write-Host "  Number: $projectNumber" -ForegroundColor White
Write-Host "  Repository: benmed00/research-platform" -ForegroundColor White
Write-Host ""
Write-Host "View your project:" -ForegroundColor Cyan
Write-Host "  https://github.com/users/benmed00/projects/$projectNumber" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Configure board columns (Backlog, To Do, In Progress, Review, Done)" -ForegroundColor White
Write-Host "  2. Create views (By Milestone, By Status)" -ForegroundColor White
Write-Host "  3. Create issues and add them to the project board" -ForegroundColor White
Write-Host "  4. See PROJECT_INITIAL_TASKS.md for task lists" -ForegroundColor White
Write-Host ""
Write-Host "✅ Project board configuration complete!" -ForegroundColor Green

