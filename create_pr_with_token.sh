#!/bin/bash
# Create PR using GitHub API
# Usage: GITHUB_TOKEN=your_token_here ./create_pr_with_token.sh

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable is required"
  echo "Usage: GITHUB_TOKEN=your_token_here ./create_pr_with_token.sh"
  exit 1
fi

REPO="benmed00/research-platform"
TITLE="feat: Implement Critical Priorities - Testing, Performance, Security, Export & Search"
HEAD="yakov/critical-priorities-implementation"
BASE="main"

# Read PR description and escape for JSON
BODY=$(cat PR_DESCRIPTION.md | python3 -c "import sys, json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || cat PR_DESCRIPTION.md | jq -Rs .)

# Create PR
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/$REPO/pulls \
  -d "{
    \"title\": \"$TITLE\",
    \"head\": \"$HEAD\",
    \"base\": \"$BASE\",
    \"body\": $BODY
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY_RESPONSE=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ]; then
  PR_URL=$(echo "$BODY_RESPONSE" | jq -r '.html_url')
  PR_NUMBER=$(echo "$BODY_RESPONSE" | jq -r '.number')
  echo "✅ Pull Request created successfully!"
  echo "📝 PR #$PR_NUMBER: $PR_URL"
  echo "$PR_URL" > .pr_url
  exit 0
else
  echo "❌ Failed to create PR (HTTP $HTTP_CODE)"
  echo "Response:"
  echo "$BODY_RESPONSE" | jq '.' 2>/dev/null || echo "$BODY_RESPONSE"
  exit 1
fi
