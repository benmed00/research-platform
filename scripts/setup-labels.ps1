# PowerShell script to create labels for Research Platform repository
# This script creates all necessary labels for issue tracking

Write-Host "🏷️  Creating labels for Research Platform repository" -ForegroundColor Green
Write-Host ""

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
$errorCount = 0

foreach ($label in $labels) {
    $labelName = $label.Name
    $labelDesc = $label.Description
    $labelColor = $label.Color
    
    # Check if label exists
    $checkResult = gh label list --repo benmed00/research-platform --json name --jq ".[] | select(.name == `"$labelName`")" 2>&1
    
    if ($LASTEXITCODE -eq 0 -and $checkResult) {
        Write-Host "  ⏭️  Label '$labelName' already exists" -ForegroundColor Yellow
        $existingCount++
    } else {
        $result = gh label create $labelName --description $labelDesc --color $labelColor --repo benmed00/research-platform 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Created label: $labelName" -ForegroundColor Green
            $createdCount++
        } else {
            Write-Host "  ❌ Failed to create label: $labelName" -ForegroundColor Red
            $errorCount++
        }
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Created: $createdCount" -ForegroundColor Green
Write-Host "  ⏭️  Existing: $existingCount" -ForegroundColor Yellow
if ($errorCount -gt 0) {
    Write-Host "  ❌ Errors: $errorCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "Label creation complete!" -ForegroundColor Green

