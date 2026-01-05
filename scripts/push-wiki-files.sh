#!/bin/bash
# Script to push Wiki files to GitHub Wiki repository
# Run this after Wiki is enabled in repository settings

set -e

echo "📚 Pushing Wiki Files to GitHub Wiki"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -d "wiki" ]; then
    echo "❌ wiki/ directory not found"
    echo "   Make sure you're in the repository root"
    exit 1
fi

WIKI_DIR="../research-platform.wiki"

echo "📋 Step 1: Clone or initialize Wiki repository"
echo ""

if [ -d "$WIKI_DIR" ]; then
    echo "⚠️  Wiki directory exists: $WIKI_DIR"
    read -p "Remove and re-clone? (y/n): " RECLONE
    if [ "$RECLONE" = "y" ] || [ "$RECLONE" = "Y" ]; then
        rm -rf "$WIKI_DIR"
    else
        echo "Using existing wiki directory"
        cd "$WIKI_DIR"
        git pull origin master 2>/dev/null || git pull origin main 2>/dev/null || true
        cd - > /dev/null
    fi
fi

if [ ! -d "$WIKI_DIR" ]; then
    echo "Cloning wiki repository..."
    cd ..
    git clone https://github.com/benmed00/research-platform.wiki.git research-platform.wiki 2>&1 || {
        echo ""
        echo "❌ Failed to clone wiki repository"
        echo ""
        echo "The Wiki repository might not be initialized yet."
        echo "Please:"
        echo "1. Go to: https://github.com/benmed00/research-platform/settings"
        echo "2. Enable 'Wikis' in the Features section"
        echo "3. Go to: https://github.com/benmed00/research-platform/wiki"
        echo "4. Create at least one page to initialize the wiki"
        echo "5. Then run this script again"
        exit 1
    }
    cd - > /dev/null
fi

echo ""
echo "📋 Step 2: Copy Wiki files"
echo ""

cd "$WIKI_DIR"

# Copy all markdown files
cp ../research-platform/wiki/*.md . 2>/dev/null || {
    echo "❌ Could not find wiki files"
    echo "   Make sure wiki/ directory exists in repository root"
    exit 1
}

# Remove summary file (not needed in wiki)
rm -f WIKI_GENERATION_SUMMARY.md 2>/dev/null || true

echo "✅ Copied $(ls -1 *.md | wc -l) Wiki pages"
echo ""

# Show files
echo "📄 Files to commit:"
ls -1 *.md | head -15
echo ""

read -p "Review files above, then press Enter to continue..."

echo ""
echo "📋 Step 3: Commit and push"
echo ""

git add *.md

# Check if there are changes
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit (files might already be up to date)"
else
    git commit -m "docs: add comprehensive Wiki documentation

- 12 Wiki pages covering all aspects of the platform
- Architecture, modules, data model, workflows
- Development and contribution guides
- Roadmap and future plans

Generated: $(date)" --author="IBEN-YAKOVE <benyakoub.dev@gmail.com>"
    
    echo ""
    echo "📤 Pushing to GitHub..."
    git push origin master 2>/dev/null || git push origin main 2>/dev/null || {
        echo ""
        echo "❌ Failed to push. Trying with authentication..."
        # Try with token
        TOKEN=$(gh auth token 2>/dev/null || echo "")
        if [ -n "$TOKEN" ]; then
            git remote set-url origin https://${TOKEN}@github.com/benmed00/research-platform.wiki.git
            git push origin master 2>/dev/null || git push origin main 2>/dev/null
        else
            echo "❌ Could not push. Please:"
            echo "1. Check your GitHub authentication: gh auth status"
            echo "2. Or push manually: cd $WIKI_DIR && git push"
            exit 1
        fi
    }
    
    echo ""
    echo "✅ Wiki files pushed successfully!"
fi

cd - > /dev/null

echo ""
echo "📚 Wiki is now available at:"
echo "   https://github.com/benmed00/research-platform/wiki"
echo ""
echo "✅ Complete!"
