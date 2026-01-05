# GitHub Token Setup Guide

## Creating a Personal Access Token (PAT) with Proper Permissions

### Step 1: Create a New Token

1. Go to GitHub Settings:
   - Click your profile picture (top right)
   - Click **Settings**
   - Or go directly to: https://github.com/settings/tokens

2. Navigate to Developer Settings:
   - Scroll down in the left sidebar
   - Click **Developer settings**
   - Click **Personal access tokens**
   - Click **Tokens (classic)** or **Fine-grained tokens**

### Step 2: Generate New Token

**For Classic Tokens:**
1. Click **Generate new token** → **Generate new token (classic)**
2. Give it a descriptive name: `Research Platform - PR Management`
3. Set expiration (recommended: 90 days or custom)
4. Select the following **scopes/permissions**:

   **Required Scopes:**
   - ✅ `repo` (Full control of private repositories)
     - This includes:
       - `repo:status` - Access commit status
       - `repo_deployment` - Access deployment status
       - `public_repo` - Access public repositories
       - `repo:invite` - Access repository invitations
       - `security_events` - Access security events

   **Additional Scopes (if needed):**
   - ✅ `write:org` - Write org and team membership (if organization repo)
   - ✅ `read:org` - Read org and team membership (if organization repo)
   - ✅ `project` - Full control of user projects (for project board access)

5. Click **Generate token**
6. **IMPORTANT**: Copy the token immediately (you won't see it again!

**For Fine-grained Tokens (Recommended):**
1. Click **Generate new token** → **Generate new token (fine-grained)**
2. Select repository: `benmed00/research-platform`
3. Give it a name: `Research Platform - PR Management`
4. Set expiration
5. Under **Repository permissions**, select:
   - **Issues**: Read and write
   - **Pull requests**: Read and write
   - **Metadata**: Read (required)
   - **Contents**: Read (if needed for file access)
6. Under **Organization permissions** (if applicable):
   - **Projects**: Read and write
7. Click **Generate token**
8. Copy the token

### Step 3: Configure the Token

**Option A: Using gh CLI (Recommended)**

```bash
# Authenticate with the new token
gh auth login

# Select:
# - GitHub.com
# - HTTPS
# - Paste your token when prompted
# - Authenticate Git with your credentials? Yes
```

**Option B: Set as Environment Variable**

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export GITHUB_TOKEN="your_token_here"

# Or for current session only
export GITHUB_TOKEN="your_token_here"
```

**Option C: Use gh auth token command**

```bash
# Set token directly
gh auth token --hostname github.com < your_token.txt

# Or set it
echo "your_token_here" | gh auth login --with-token
```

### Step 4: Verify Token Permissions

Test the token:

```bash
# Check current authentication
gh auth status

# Test PR access
gh pr view 60

# Test label access (should work now)
gh pr edit 60 --add-label "test-label" --remove-label "test-label"
```

### Step 5: Use the Token

Once configured, you can run:

```bash
# Add labels, milestone, and project to PR #60
bash scripts/add-pr-60-details.sh
```

## Required Permissions Summary

| Permission | Why Needed |
|------------|------------|
| `repo` (classic) or `Pull requests: Write` | To edit PR labels and metadata |
| `Issues: Write` | To set milestones on PRs |
| `Projects: Write` | To add PR to project boards |
| `Metadata: Read` | Required for all API access |

## Security Best Practices

1. **Never commit tokens to git**
2. **Use fine-grained tokens** when possible (more secure)
3. **Set appropriate expiration** (90 days recommended)
4. **Rotate tokens regularly**
5. **Use environment variables** instead of hardcoding
6. **Revoke unused tokens** immediately

## Troubleshooting

### "Resource not accessible by integration"
- Token doesn't have write permissions
- Recreate token with proper scopes

### "Authentication failed"
- Token expired or revoked
- Check token validity in GitHub Settings

### "Permission denied"
- Token doesn't have access to the repository
- Ensure token has `repo` scope or repository access

## Quick Setup Script

```bash
#!/bin/bash
# Quick token setup

echo "🔐 GitHub Token Setup"
echo ""
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select 'repo' scope"
echo "4. Copy the token"
echo ""
read -p "Paste your token here: " TOKEN

echo "$TOKEN" | gh auth login --with-token

echo ""
echo "✅ Token configured!"
echo "Testing..."
gh auth status
```
