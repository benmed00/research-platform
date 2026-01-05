#!/bin/bash
# Script to set up GitHub Project Board for Research Platform
# This script helps create and configure the project board

set -e

echo "🚀 Setting up GitHub Project Board for Research Platform"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Please install it from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "   Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Check if project scope is available
echo "📋 Checking authentication scopes..."
if gh auth status 2>&1 | grep -q "project"; then
    echo "✅ Project scope is available"
else
    echo "⚠️  Project scope is required. Please run:"
    echo "   gh auth refresh -s project"
    echo ""
    read -p "Do you want to add the project scope now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh auth refresh -s project
    else
        echo "⚠️  Skipping project creation. You can create it manually via:"
        echo "   https://github.com/benmed00/research-platform/projects/new"
        exit 0
    fi
fi

echo ""
echo "📦 Creating project board..."

# Create the project
PROJECT_OUTPUT=$(gh project create --owner benmed00 --title "Research Platform Development" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Project board created successfully!"
    
    # Extract project number (if possible)
    PROJECT_NUMBER=$(echo "$PROJECT_OUTPUT" | grep -oP 'number":\s*\K[0-9]+' || echo "")
    
    if [ -n "$PROJECT_NUMBER" ]; then
        echo "📊 Project number: $PROJECT_NUMBER"
        echo ""
        echo "🔗 Linking project to repository..."
        gh project link "$PROJECT_NUMBER" --owner benmed00 --repo research-platform 2>&1 || echo "⚠️  Could not auto-link. Please link manually."
    fi
    
    echo ""
    echo "✅ Project board setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Visit: https://github.com/benmed00/research-platform/projects"
    echo "   2. Configure board columns (Backlog, To Do, In Progress, Review, Done)"
    echo "   3. Set up views (By Milestone, By Status, By Priority)"
    echo "   4. Add automation rules"
    echo ""
else
    echo "❌ Failed to create project board"
    echo "$PROJECT_OUTPUT"
    echo ""
    echo "💡 You can create it manually:"
    echo "   https://github.com/benmed00/research-platform/projects/new"
fi

