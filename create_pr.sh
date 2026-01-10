#!/bin/bash
# Create PR using GitHub API

TOKEN=$(git remote get-url origin | sed -n 's/.*x-access-token:\([^@]*\)@.*/\1/p')
REPO="benmed00/research-platform"
TITLE="feat: Implement Critical Priorities - Testing, Performance, Security, Export & Search"
HEAD="yakov/critical-priorities-implementation"
BASE="main"

# Read PR description and escape for JSON
BODY=$(cat PR_DESCRIPTION.md | python3 -c "import sys, json; print(json.dumps(sys.stdin.read()))")

# Create PR
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $TOKEN" \
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
else
  echo "❌ Failed to create PR (HTTP $HTTP_CODE)"
  echo "$BODY_RESPONSE" | jq -r '.message // .errors[0].message // .'
  exit 1
fi
