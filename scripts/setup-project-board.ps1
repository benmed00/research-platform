# PowerShell script to set up GitHub Project Board for Research Platform
# This script helps create and configure the project board

Write-Host "🚀 Setting up GitHub Project Board for Research Platform" -ForegroundColor Green
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

# Check if project scope is available
Write-Host "📋 Checking authentication scopes..." -ForegroundColor Cyan
$authScopes = gh auth status 2>&1 | Select-String "project"

if ($authScopes) {
    Write-Host "✅ Project scope is available" -ForegroundColor Green
} else {
    Write-Host "⚠️  Project scope is required." -ForegroundColor Yellow
    Write-Host "   Please run: gh auth refresh -s project" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Do you want to add the project scope now? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        gh auth refresh -s project
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Project scope added" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Could not add scope automatically. Please run manually:" -ForegroundColor Yellow
            Write-Host "   gh auth refresh -s project" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "💡 You can create the project manually:" -ForegroundColor Cyan
            Write-Host "   https://github.com/benmed00/research-platform/projects/new" -ForegroundColor Cyan
            exit 0
        }
    } else {
        Write-Host "⚠️  Skipping project creation. You can create it manually via:" -ForegroundColor Yellow
        Write-Host "   https://github.com/benmed00/research-platform/projects/new" -ForegroundColor Cyan
        exit 0
    }
}

Write-Host ""
Write-Host "📦 Creating project board..." -ForegroundColor Cyan

# Create the project
$projectOutput = gh project create --owner benmed00 --title "Research Platform Development" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Project board created successfully!" -ForegroundColor Green
    
    # Try to extract project number
    if ($projectOutput -match '"number":\s*(\d+)') {
        $projectNumber = $matches[1]
        Write-Host "📊 Project number: $projectNumber" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🔗 Linking project to repository..." -ForegroundColor Cyan
        gh project link $projectNumber --owner benmed00 --repo research-platform 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Project linked to repository" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Could not auto-link. Please link manually." -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "✅ Project board setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Visit: https://github.com/benmed00/research-platform/projects" -ForegroundColor White
    Write-Host "   2. Configure board columns (Backlog, To Do, In Progress, Review, Done)" -ForegroundColor White
    Write-Host "   3. Set up views (By Milestone, By Status, By Priority)" -ForegroundColor White
    Write-Host "   4. Add automation rules" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Failed to create project board" -ForegroundColor Red
    Write-Host $projectOutput -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 You can create it manually:" -ForegroundColor Cyan
    Write-Host "   https://github.com/benmed00/research-platform/projects/new" -ForegroundColor Cyan
}

