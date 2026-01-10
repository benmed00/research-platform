# Script to assign all issues to GitHub Projects v2 using GraphQL API
# Usage: .\scripts\assign-issues-to-project-graphql.ps1 -ProjectNumber <number>

param(
    [Parameter(Mandatory=$false)]
    [int]$ProjectNumber = 5,
    
    [Parameter(Mandatory=$false)]
    [string]$Owner = "benmed00",
    
    [Parameter(Mandatory=$false)]
    [string]$Repo = "research-platform"
)

$token = $env:GH_TOKEN
if (-not $token) {
    Write-Host "Error: GH_TOKEN environment variable not set" -ForegroundColor Red
    exit 1
}

Write-Host "Assigning all issues from $Owner/$Repo to project #$ProjectNumber" -ForegroundColor Cyan

# Step 1: Get project node ID
Write-Host "Getting project node ID..." -ForegroundColor Yellow
$projectQuery = @"
query {
  viewer {
    projectV2(number: $ProjectNumber) {
      id
      title
    }
  }
}
"@

$projectResponse = gh api graphql -f query=$projectQuery | ConvertFrom-Json
$projectId = $projectResponse.data.viewer.projectV2.id
$projectTitle = $projectResponse.data.viewer.projectV2.title

Write-Host "Project: $projectTitle (ID: $projectId)" -ForegroundColor Green

# Step 2: Get all issues with their node IDs (excluding Pull Requests)
Write-Host "Fetching all issues (excluding PRs)..." -ForegroundColor Yellow
$allItems = gh api repos/$Owner/$Repo/issues?state=all --paginate | ConvertFrom-Json
# Filter out Pull Requests - only keep actual issues (PRs have pull_request field)
$issues = $allItems | Where-Object { -not $_.pull_request }

$total = $issues.Count
Write-Host "Found $total issues" -ForegroundColor Cyan
Write-Host ""

$success = 0
$failed = 0
$skipped = 0

# Step 3: For each issue, get its node ID and add to project
foreach ($issue in $issues) {
    $issueNumber = $issue.number
    Write-Host "Processing issue #$issueNumber..." -NoNewline
    
    # Get issue node ID via GraphQL
    $issueQuery = "query { repository(owner: \`"$Owner\`", name: \`"$Repo\`") { issue(number: $issueNumber) { id } } }"
    
    $issueResponse = gh api graphql -f query=$issueQuery 2>&1 | ConvertFrom-Json
    
    if ($LASTEXITCODE -ne 0 -or -not $issueResponse.data.repository.issue) {
        Write-Host " (not found or is a PR)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    $issueNodeId = $issueResponse.data.repository.issue.id
    
    if (-not $issueNodeId) {
        Write-Host " (issue not found)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    # Add item to project using GraphQL mutation
    $mutation = "mutation { addProjectV2ItemById(input: { projectId: \`"$projectId\`", contentId: \`"$issueNodeId\`" }) { item { id } } }"
    
    $result = gh api graphql -f query=$mutation 2>&1
    
    if ($LASTEXITCODE -eq 0 -and $result -notmatch "error") {
        Write-Host " OK" -ForegroundColor Green
        $success++
    } elseif ($result -match "already" -or $result -match "duplicate") {
        Write-Host " (already in project)" -ForegroundColor Yellow
        $skipped++
    } else {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  Error: $result" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Total issues: $total" -ForegroundColor White
Write-Host "  Successfully added: $success" -ForegroundColor Green
Write-Host "  Already in project: $skipped" -ForegroundColor Yellow
if ($failed -gt 0) {
    Write-Host "  Failed: $failed" -ForegroundColor Red
}
