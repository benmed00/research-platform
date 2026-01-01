# PowerShell script to create GitHub repository
# Requires GitHub CLI (gh) to be installed and authenticated

param(
    [string]$Username = "mbwk25",
    [string]$RepoName = "research-platform",
    [string]$Description = "ERP and scientific platform for environmental and biodiversity research center in northern Morocco"
)

Write-Host "🚀 Creating GitHub repository..." -ForegroundColor Green

# Check if GitHub CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Create repository
Write-Host "📦 Creating repository: $RepoName" -ForegroundColor Cyan
gh repo create $RepoName `
    --description $Description `
    --public `
    --source=. `
    --remote=origin `
    --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository created successfully!" -ForegroundColor Green
    
    # Add topics
    Write-Host "🏷️  Adding repository topics..." -ForegroundColor Cyan
    $topics = @(
        "nextjs", "typescript", "prisma", "postgresql", "postgis",
        "environmental-research", "biodiversity", "erp", "scientific-platform",
        "research-platform", "maroc", "morocco", "leaflet", "nextauth", "tailwindcss"
    )
    
    foreach ($topic in $topics) {
        gh repo edit "$Username/$RepoName" --add-topic $topic
    }
    
    # Enable features
    Write-Host "⚙️  Configuring repository features..." -ForegroundColor Cyan
    gh api repos/$Username/$RepoName -X PATCH `
        -f has_issues=true `
        -f has_projects=true `
        -f has_wiki=true `
        -f has_discussions=true
    
    Write-Host "`n✅ Repository setup complete!" -ForegroundColor Green
    Write-Host "🌐 Repository URL: https://github.com/$Username/$RepoName" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to create repository." -ForegroundColor Red
    exit 1
}

