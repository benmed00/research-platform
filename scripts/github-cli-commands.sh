# GitHub CLI commands to set up the repository
# Install GitHub CLI: https://cli.github.com/

gh repo create research-platform \
  --description "ERP and scientific platform for environmental and biodiversity research center in northern Morocco" \
  --public \
  --source=. \
  --remote=origin \
  --push

# Set repository topics
gh repo edit mbwk25/research-platform --add-topic nextjs --add-topic typescript --add-topic prisma --add-topic postgresql --add-topic postgis --add-topic environmental-research --add-topic biodiversity --add-topic erp --add-topic scientific-platform --add-topic research-platform --add-topic maroc --add-topic morocco --add-topic leaflet --add-topic nextauth --add-topic tailwindcss

# Enable features
gh api repos/mbwk25/research-platform -X PATCH -f has_issues=true -f has_projects=true -f has_wiki=true -f has_discussions=true

# Set default branch protection (optional)
gh api repos/mbwk25/research-platform/branches/main/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["ci"]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1}' -f restrictions=null
