#!/bin/bash
# Quick GitHub Token Setup Script

echo "🔐 GitHub Token Setup for PR Management"
echo "========================================"
echo ""
echo "This script will help you configure a GitHub token with proper permissions."
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    exit 1
fi

echo "📋 Step 1: Create a GitHub Personal Access Token"
echo ""
echo "1. Open: https://github.com/settings/tokens"
echo "2. Click 'Generate new token' → 'Generate new token (classic)'"
echo "3. Name: 'Research Platform - PR Management'"
echo "4. Expiration: 90 days (or your preference)"
echo "5. Select scope: ✅ repo (Full control)"
echo "6. Click 'Generate token'"
echo "7. COPY THE TOKEN (you won't see it again!)"
echo ""
read -p "Press Enter when you have your token ready..."

echo ""
echo "📋 Step 2: Authenticate with the token"
echo ""
read -p "Paste your token here: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo ""
echo "🔑 Configuring GitHub CLI..."
echo "$TOKEN" | gh auth login --with-token

echo ""
echo "✅ Token configured!"
echo ""
echo "📋 Step 3: Verifying permissions..."
echo ""

# Test authentication
if gh auth status &> /dev/null; then
    echo "✅ Authentication successful!"
    echo ""
    
    # Test PR access
    echo "Testing PR access..."
    if gh pr view 60 &> /dev/null; then
        echo "✅ Can read PR #60"
    else
        echo "⚠️  Cannot read PR #60 (check repository access)"
    fi
    
    echo ""
    echo "📋 Step 4: Adding details to PR #60..."
    echo ""
    read -p "Run the PR details script now? (y/n): " RUN_SCRIPT
    
    if [ "$RUN_SCRIPT" = "y" ] || [ "$RUN_SCRIPT" = "Y" ]; then
        bash scripts/add-pr-60-details.sh
    else
        echo ""
        echo "You can run it later with:"
        echo "  bash scripts/add-pr-60-details.sh"
    fi
else
    echo "❌ Authentication failed. Please check your token."
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Your token is now configured. You can:"
echo "  - Add labels: gh pr edit 60 --add-label 'label-name'"
echo "  - Set milestone: gh api repos/benmed00/research-platform/issues/60 --method PATCH --field 'milestone=4'"
echo "  - View PR: gh pr view 60"
