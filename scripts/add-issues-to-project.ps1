# PowerShell script to add issues to GitHub Project Board
# This script adds all open issues to the Research Platform Development project

Write-Host "Adding issues to project board..." -ForegroundColor Green
Write-Host ""

# Get project number (from URL: projects/5)
$projectNumber = 5

# Get all open issues
Write-Host "Fetching open issues..." -ForegroundColor Cyan
$issues = gh issue list --repo benmed00/research-platform --state open --json number,title --limit 50 | ConvertFrom-Json

if (-not $issues) {
    Write-Host "No open issues found." -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($issues.Count) open issues" -ForegroundColor Green
Write-Host ""

$addedCount = 0
$errorCount = 0

foreach ($issue in $issues) {
    $issueNumber = $issue.number
    $issueTitle = $issue.title
    
    Write-Host "Adding issue #${issueNumber}: ${issueTitle}" -ForegroundColor White
    
    # Add issue to project board
    $result = gh project item-add $projectNumber --owner benmed00 --url "https://github.com/benmed00/research-platform/issues/$issueNumber" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Successfully added to project board" -ForegroundColor Green
        $addedCount++
    } else {
        Write-Host "  Failed to add (may already be in project or missing project scope)" -ForegroundColor Yellow
        Write-Host "  Error: $result" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Added: $addedCount" -ForegroundColor Green
Write-Host "  Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($errorCount -gt 0) {
    Write-Host "Note: If you see errors, you may need to:" -ForegroundColor Yellow
    Write-Host "  1. Refresh auth with project scope: gh auth refresh -s project" -ForegroundColor Cyan
    Write-Host "  2. Verify project number is correct (currently: $projectNumber)" -ForegroundColor Cyan
    Write-Host "  3. Check that issues aren't already in the project" -ForegroundColor Cyan
}

