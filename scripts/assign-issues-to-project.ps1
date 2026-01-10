# Script to assign all issues to a GitHub project
# Usage: .\scripts\assign-issues-to-project.ps1 -ProjectNumber <number> -Owner <owner>
#
# Example: .\scripts\assign-issues-to-project.ps1 -ProjectNumber 1 -Owner benmed00

param(
    [Parameter(Mandatory=$false)]
    [int]$ProjectNumber = 5,  # Default to project 5 (Research Platform Development)
    
    [Parameter(Mandatory=$false)]
    [string]$Owner = "benmed00",
    
    [Parameter(Mandatory=$false)]
    [string]$Repo = "research-platform",
    
    [Parameter(Mandatory=$false)]
    [switch]$OpenOnly = $false  # If true, only assign open issues
)

Write-Host "Assigning all issues from $Owner/$Repo to project #$ProjectNumber" -ForegroundColor Cyan

# Get all issues (or only open if flag is set)
$state = if ($OpenOnly) { "open" } else { "all" }
Write-Host "Fetching $state issues..." -ForegroundColor Yellow
$issues = gh api repos/$Owner/$Repo/issues?state=$state --paginate | ConvertFrom-Json

$total = $issues.Count
$success = 0
$failed = 0
$skipped = 0

foreach ($issue in $issues) {
    $issueNumber = $issue.number
    $issueUrl = "https://github.com/$Owner/$Repo/issues/$issueNumber"
    
    Write-Host "Adding issue #$issueNumber to project..." -NoNewline
    
    $result = gh project item-add $ProjectNumber --owner $Owner --url $issueUrl 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
        $success++
    } elseif ($result -match "already") {
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
