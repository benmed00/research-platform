#!/bin/bash
# Script to add labels, milestone, and project to PR #60
# Run with: bash scripts/add-pr-60-details.sh

PR_NUMBER=60

echo "📋 Adding details to PR #$PR_NUMBER..."
echo ""

# Add labels
echo "🏷️  Adding labels..."
gh pr edit $PR_NUMBER --add-label "documentation" || echo "   ⚠️  Could not add 'documentation' label"
gh pr edit $PR_NUMBER --add-label "type:documentation" || echo "   ⚠️  Could not add 'type:documentation' label"
gh pr edit $PR_NUMBER --add-label "enhancement" || echo "   ⚠️  Could not add 'enhancement' label"
gh pr edit $PR_NUMBER --add-label "priority:medium" || echo "   ⚠️  Could not add 'priority:medium' label"

# Remove old priority label if different
gh pr edit $PR_NUMBER --remove-label "priority:low" 2>/dev/null || true

# Set milestone (v1.3 - Quality & Polish, milestone #4)
echo ""
echo "🎯 Setting milestone..."
gh api repos/benmed00/research-platform/issues/$PR_NUMBER \
  --method PATCH \
  --field 'milestone=4' \
  && echo "   ✅ Set milestone: v1.3 - Quality & Polish" \
  || echo "   ⚠️  Could not set milestone"

echo ""
echo "📊 Project: Research Platform Development"
echo "   Note: Add PR to project manually via GitHub UI:"
echo "   https://github.com/benmed00/research-platform/pull/$PR_NUMBER"

echo ""
echo "✅ Complete! Check PR #$PR_NUMBER for updated details."
