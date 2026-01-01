# Script PowerShell pour résoudre le problème EPERM avec Prisma Client
# Usage: .\scripts\fix-prisma-client.ps1

Write-Host "🔧 Résolution du problème EPERM avec Prisma Client" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Vérifier les processus Node.js
Write-Host "📋 Étape 1: Vérification des processus Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "  ⚠️  Processus Node.js trouvés:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "    - PID: $($_.Id) - $($_.ProcessName)" -ForegroundColor Yellow
    }
    Write-Host ""
    $response = Read-Host "  Voulez-vous arrêter tous les processus Node.js? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        $nodeProcesses | Stop-Process -Force
        Write-Host "  ✅ Processus Node.js arrêtés" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Continuez manuellement en fermant le serveur Next.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✅ Aucun processus Node.js en cours" -ForegroundColor Green
}

Write-Host ""

# Étape 2: Supprimer le dossier .prisma
Write-Host "📋 Étape 2: Nettoyage du dossier .prisma..." -ForegroundColor Yellow
$prismaPath = Join-Path $PSScriptRoot "..\node_modules\.prisma"
if (Test-Path $prismaPath) {
    try {
        Remove-Item -Path $prismaPath -Recurse -Force
        Write-Host "  ✅ Dossier .prisma supprimé" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Erreur lors de la suppression: $_" -ForegroundColor Red
        Write-Host "  💡 Essayez de fermer tous les processus qui utilisent ces fichiers" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  ℹ️  Dossier .prisma n'existe pas" -ForegroundColor Gray
}

Write-Host ""

# Étape 3: Régénérer le Prisma Client
Write-Host "📋 Étape 3: Régénération du Prisma Client..." -ForegroundColor Yellow
Set-Location (Join-Path $PSScriptRoot "..")
try {
    npm run db:generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Prisma Client régénéré avec succès" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erreur lors de la régénération" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Résolution terminée!" -ForegroundColor Green
Write-Host "💡 Vous pouvez maintenant redémarrer le serveur avec: npm run dev" -ForegroundColor Cyan

