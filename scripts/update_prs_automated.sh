#!/bin/bash
# Script to update all PR descriptions using GitHub CLI
# Requires: gh CLI authenticated with proper permissions
# Usage: ./update_prs_automated.sh

set -e

REPO="benmed00/research-platform"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔍 Checking GitHub CLI authentication..."
if ! gh auth status &>/dev/null; then
    echo "❌ GitHub CLI not authenticated. Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Function to update a PR description
update_pr() {
    local pr_number=$1
    local description_file=$2
    
    echo "📝 Updating PR #${pr_number}..."
    
    if gh pr edit "${pr_number}" --body-file "${description_file}" 2>/dev/null; then
        echo "  ✅ Successfully updated PR #${pr_number}"
        return 0
    else
        echo "  ⚠️  Failed to update PR #${pr_number} (may need manual update)"
        return 1
    fi
}

# Extract descriptions from the markdown file and update each PR
# This is a simplified version - in practice, you'd extract each description

echo "📋 Note: This script requires manual extraction of descriptions from PR_DESCRIPTIONS_TO_UPDATE.md"
echo "   Or use the Python script with a token that has write permissions"
echo ""
echo "To update PRs manually:"
echo "1. Open PR_DESCRIPTIONS_TO_UPDATE.md"
echo "2. Copy each PR description"
echo "3. Go to the PR on GitHub and paste the description"
echo ""
echo "Or use the Python script with a GitHub token:"
echo "  export GITHUB_TOKEN=your_token_here"
echo "  python3 update_all_pr_descriptions.py"
