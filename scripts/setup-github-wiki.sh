#!/bin/bash
# Script to set up GitHub Wiki from wiki/ directory
# GitHub Wiki is a separate git repository

echo "📚 GitHub Wiki Setup Script"
echo "=========================="
echo ""

# Check if wiki directory exists
if [ ! -d "wiki" ]; then
    echo "❌ wiki/ directory not found"
    echo "   Make sure you're in the repository root"
    exit 1
fi

echo "📋 Step 1: Enable GitHub Wiki"
echo ""
echo "1. Go to: https://github.com/benmed00/research-platform/settings"
echo "2. Scroll to 'Features' section"
echo "3. Enable 'Wikis' checkbox"
echo "4. Click 'Save'"
echo ""
read -p "Press Enter when Wiki is enabled..."

echo ""
echo "📋 Step 2: Clone Wiki Repository"
echo ""

WIKI_DIR="research-platform.wiki"
if [ -d "$WIKI_DIR" ]; then
    echo "⚠️  Wiki directory already exists: $WIKI_DIR"
    read -p "Remove and re-clone? (y/n): " RECLONE
    if [ "$RECLONE" = "y" ] || [ "$RECLONE" = "Y" ]; then
        rm -rf "$WIKI_DIR"
    else
        echo "Using existing wiki directory"
    fi
fi

if [ ! -d "$WIKI_DIR" ]; then
    echo "Cloning wiki repository..."
    git clone https://github.com/benmed00/research-platform.wiki.git "$WIKI_DIR" 2>&1 || {
        echo "❌ Failed to clone wiki repository"
        echo "   Make sure Wiki is enabled in repository settings"
        exit 1
    }
fi

echo ""
echo "📋 Step 3: Copy Wiki Files"
echo ""

cd "$WIKI_DIR" || exit 1

# Copy all markdown files from wiki/ to wiki repository
cp ../wiki/*.md . 2>&1

# Remove the summary file (not needed in wiki)
rm -f WIKI_GENERATION_SUMMARY.md 2>&1 || true

echo "✅ Copied wiki files"
echo ""

# Show what will be committed
echo "📋 Files to commit:"
ls -1 *.md | head -15
echo ""

read -p "Review files above, then press Enter to continue..."

echo ""
echo "📋 Step 4: Commit and Push"
echo ""

git add *.md
git commit -m "docs: add comprehensive Wiki documentation

- 12 Wiki pages covering all aspects of the platform
- Architecture, modules, data model, workflows
- Development and contribution guides
- Roadmap and future plans

Generated: $(date)"

echo ""
read -p "Push to GitHub Wiki? (y/n): " PUSH

if [ "$PUSH" = "y" ] || [ "$PUSH" = "Y" ]; then
    git push origin master || git push origin main
    echo ""
    echo "✅ Wiki pushed successfully!"
    echo ""
    echo "📚 Wiki is now available at:"
    echo "   https://github.com/benmed00/research-platform/wiki"
else
    echo ""
    echo "⚠️  Wiki files committed locally but not pushed"
    echo "   Push manually with: cd $WIKI_DIR && git push"
fi

cd ..

echo ""
echo "✅ Wiki setup complete!"
echo ""
echo "Next: Verify Wiki at https://github.com/benmed00/research-platform/wiki"
