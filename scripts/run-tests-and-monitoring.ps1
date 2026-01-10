# Script PowerShell pour exécuter la suite de tests et vérifier la configuration de monitoring
# Basé sur les tâches définies dans scripts/create-comprehensive-tasks.ts (lignes 602-759)

Write-Host "🚀 Démarrage de la suite de tests et vérification du monitoring..." -ForegroundColor Cyan
Write-Host ""

# 1. Tests d'intégration (API Routes)
Write-Host "📋 1. Exécution des tests d'intégration (Vitest)..." -ForegroundColor Yellow
if (Test-Path "vitest.config.ts") {
    Write-Host "  Configuration Vitest détectée." -ForegroundColor Gray
    try {
        npm run test:run
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Tests d'intégration réussis" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Échec des tests d'intégration" -ForegroundColor Red
            # On continue même si ça échoue pour tout voir
        }
    } catch {
        Write-Host "  ❌ Erreur lors de l'exécution des tests: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠️  Configuration Vitest non trouvée" -ForegroundColor Yellow
}
Write-Host ""

# 2. Tests E2E (Playwright)
Write-Host "📋 2. Vérification des tests E2E (Playwright)..." -ForegroundColor Yellow
if (Test-Path "playwright.config.ts") {
    Write-Host "  Configuration Playwright détectée." -ForegroundColor Gray
    $response = Read-Host "  Voulez-vous lancer les tests E2E? (cela peut prendre du temps) (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        try {
            npx playwright test
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Tests E2E réussis" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Échec des tests E2E" -ForegroundColor Red
            }
        } catch {
            Write-Host "  ❌ Erreur lors de l'exécution des tests E2E: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ℹ️  Tests E2E ignorés" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠️  Configuration Playwright non trouvée (ou fichier config manquant)" -ForegroundColor Yellow
    # Vérifier package.json pour voir si playwright est installé
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.devDependencies.'@playwright/test') {
        Write-Host "  ℹ️  Playwright est listé dans les dépendances." -ForegroundColor Gray
    }
}
Write-Host ""

# 3. Vérification Sentry (Error Tracking)
Write-Host "📋 3. Vérification de la configuration Sentry..." -ForegroundColor Yellow
if (Test-Path "sentry.client.config.ts") {
    Write-Host "  ✅ Fichier de configuration Sentry client trouvé" -ForegroundColor Green
} else {
    Write-Host "  ❌ Fichier sentry.client.config.ts manquant" -ForegroundColor Red
}

if (Test-Path "sentry.server.config.ts") {
    Write-Host "  ✅ Fichier de configuration Sentry server trouvé" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Fichier sentry.server.config.ts manquant" -ForegroundColor Yellow
}

if (Test-Path "sentry.edge.config.ts") {
    Write-Host "  ✅ Fichier de configuration Sentry edge trouvé" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Fichier sentry.edge.config.ts manquant" -ForegroundColor Yellow
}

# Vérification des variables d'environnement (simulée)
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    if ($envContent -match "SENTRY_DSN") {
        Write-Host "  ✅ SENTRY_DSN trouvé dans .env" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  SENTRY_DSN non trouvé dans .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ℹ️  Fichier .env non vérifié (peut ne pas exister en dev)" -ForegroundColor Gray
}
Write-Host ""

# 4. APM (Application Performance Monitoring)
Write-Host "📋 4. Vérification APM..." -ForegroundColor Yellow
Write-Host "  ℹ️  L'APM est généralement géré par Sentry ou un autre fournisseur en prod." -ForegroundColor Gray
if ($packageJson.dependencies.'@sentry/nextjs') {
    Write-Host "  ✅ @sentry/nextjs détecté (gère aussi l'APM)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Dépendance @sentry/nextjs non trouvée" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Vérifications terminées." -ForegroundColor Cyan
