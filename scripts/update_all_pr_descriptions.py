#!/usr/bin/env python3
"""
Update all 15 open PR descriptions according to repository documentation.
Based on docs/ALL_PRS_UPDATE_GUIDE.md and .github/pull_request_template.md
"""

import os
import sys
import json
import re
import subprocess
from typing import Dict, List, Optional, Tuple

REPO = "benmed00/research-platform"

def get_version_change_type(old_ver: str, new_ver: str) -> str:
    """Determine if version change is major, minor, or patch."""
    try:
        # Handle version strings like "3", "4", "1", "2" (for GitHub Actions)
        if old_ver.isdigit() and new_ver.isdigit():
            old_num = int(old_ver)
            new_num = int(new_ver)
            if old_num != new_num:
                return "Major"
            return "Patch"
        
        # Handle semantic versioning
        old_parts = [int(x) for x in old_ver.split(".")[:3]]
        new_parts = [int(x) for x in new_ver.split(".")[:3]]
        
        if old_parts[0] != new_parts[0]:
            return "Major"
        elif len(old_parts) > 1 and len(new_parts) > 1 and old_parts[1] != new_parts[1]:
            return "Minor"
        else:
            return "Patch"
    except:
        return "Unknown"

def extract_dependency_info(title: str) -> Optional[Dict]:
    """Extract dependency update information from PR title."""
    patterns = [
        r"bump\s+([^\s]+)\s+from\s+([^\s]+)\s+to\s+([^\s]+)",
        r"Bumps\s+([^\s]+)\s+from\s+([^\s]+)\s+to\s+([^\s]+)",
        r"bump\s+([^\s]+)\s+and\s+([^\s]+)",  # For PR #11 (bcryptjs and @types/bcryptjs)
    ]
    
    for pattern in patterns:
        match = re.search(pattern, title, re.IGNORECASE)
        if match:
            if " and " in title.lower():
                # Special case for PR #11
                return {
                    "package": f"{match.group(1)} and {match.group(2)}",
                    "old_version": "2.4.3",
                    "new_version": "3.0.3"
                }
            return {
                "package": match.group(1),
                "old_version": match.group(2),
                "new_version": match.group(3)
            }
    return None

def get_priority_for_dependency(package: str, change_type: str) -> str:
    """Determine priority based on package and change type."""
    if change_type == "Major":
        return "High"
    
    # High priority packages even for minor/patch
    high_priority_packages = ["date-fns", "@types/node", "bcryptjs", "tailwind-merge"]
    if any(pkg in package for pkg in high_priority_packages):
        return "Medium"
    
    return "Medium" if change_type == "Minor" else "Low"

def generate_dependency_pr_description(dep_info: Dict, pr_number: int) -> str:
    """Generate comprehensive PR description for dependency updates."""
    package = dep_info["package"]
    old_ver = dep_info["old_version"]
    new_ver = dep_info["new_version"]
    change_type = get_version_change_type(old_ver, new_ver)
    priority = get_priority_for_dependency(package, change_type)
    
    # Special compatibility notes
    compatibility_notes = {
        "tailwind-merge": {
            "3.4.0": "Supports Tailwind CSS v4.1.5, includes performance optimizations (>10% faster). Should be backward compatible."
        },
        "lucide-react": {
            "0.562.0": "Icon library update - mostly new icons and bug fixes, should be backward compatible."
        },
        "@types/node": {
            "25.0.3": "Type definitions for Node.js 25 - ensure Node.js version compatibility. May require Node.js version update."
        },
        "date-fns": {
            "4.1.0": "Major version bump - check for breaking changes in date formatting APIs. Review migration guide."
        },
        "bcryptjs": {
            "3.0.3": "Major version update with ESM support and 2b hash format by default. Existing hashes continue to work."
        },
        "github/codeql-action": {
            "4": "CodeQL security scanning update - review for new security scan features."
        },
        "actions/checkout": {
            "6": "GitHub Actions checkout update - verify workflow compatibility."
        },
        "actions/setup-node": {
            "6": "Node.js setup action update - verify Node.js version compatibility."
        },
        "actions/upload-artifact": {
            "6": "Artifact upload action update - verify workflow compatibility."
        },
        "softprops/action-gh-release": {
            "2": "GitHub release action update - review workflow file changes."
        }
    }
    
    breaking_warning = ""
    compatibility_note = ""
    
    if change_type == "Major":
        breaking_warning = "⚠️ **Breaking changes possible** - Please review changelog and migration guide"
    else:
        breaking_warning = "✅ Should be backward compatible"
    
    # Add specific compatibility notes
    for pkg_key, notes in compatibility_notes.items():
        if pkg_key in package:
            for version, note in notes.items():
                if version in new_ver or version == new_ver:
                    compatibility_note = note
                    break
    
    description = f"""## 📦 Dependency Update: {package}

### Version Change
- **Previous**: `{old_ver}`
- **New**: `{new_ver}`
- **Change Type**: {change_type} version bump

### ⚠️ Compatibility Analysis

{breaking_warning}
"""
    
    if compatibility_note:
        description += f"\n**Note**: {compatibility_note}\n"
    
    description += f"""
### 🔧 Changes Required

- [ ] Dependency updated in `package.json` or workflow file
- [ ] Lock file updated (if applicable)
- [ ] Build verified: `npm run build` (for npm packages)
- [ ] Tests verified: `npm run test:run` (for npm packages)
- [ ] Linting verified: `npm run lint` (for npm packages)
- [ ] Workflow verified (for GitHub Actions)
- [ ] Affected functionality tested manually

### ✅ Verification Checklist

- [ ] Build succeeds: `npm run build` (for npm packages)
- [ ] All tests pass: `npm run test:run` (for npm packages)
- [ ] Linting passes: `npm run lint` (for npm packages)
- [ ] No TypeScript errors (for npm packages)
- [ ] Workflow runs successfully (for GitHub Actions)
- [ ] Affected functionality tested manually
- [ ] Breaking changes reviewed and addressed (if applicable)
- [ ] Migration guide reviewed (if applicable)

"""
    
    if change_type == "Major" and compatibility_note:
        description += """### 📝 Migration Notes

Please review the migration guide for this major version update and address any breaking changes.
"""
    
    description += f"""### 🔗 Related

- **Milestone**: v1.3 - Quality & Polish
- **Type**: Maintenance / Dependency Update
- **Priority**: {priority}
- **Breaking**: {"Yes" if change_type == "Major" else "No"}

### 🚀 Status

⏳ Awaiting verification and testing
"""
    
    return description

def generate_non_dependency_pr_description(pr_number: int, title: str, current_body: str) -> str:
    """Generate PR description for non-dependency PRs."""
    
    if pr_number == 84:
        return """## 🔧 Fix Invalid Action Input Error

### Problem
- Error: `Invalid action input 'sha'` in status-check.yml
- `actions/checkout@v4` doesn't support a `sha` parameter

### Solution
- Removed invalid `sha` parameter
- Use `ref` with SHA directly: `ref: ${{ github.event.workflow_run.head_sha }}`
- This is the correct way to checkout a specific commit SHA

### Changes Made
- `.github/workflows/status-check.yml`: Removed `sha` parameter, use `ref` with SHA

### Testing
- [x] YAML syntax validated
- [x] Workflow structure correct
- [ ] CI checks passing

### Related
- **Type**: Bug fix
- **Priority**: High
- **Milestone**: v1.3 - Quality & Polish

### 🚀 Status
✅ Ready for review - Fixes the workflow error preventing status checks from running.
"""
    
    elif pr_number == 85 or pr_number == 86:
        return f"""## Review Cursor Cloud Agent Changes

### Description
This branch contains automated changes from Cursor cloud agent that need review.

### Action Required
- [ ] Review changes
- [ ] Determine if changes should be merged or branch deleted
- [ ] Update or close PR as needed

### Changes
{current_body if current_body else "Automated changes from Cursor cloud agent"}

### Related
- **Type**: Review / Automated changes
- **Priority**: Low
- **Status**: Needs review

### 🚀 Status
⏳ Awaiting review
"""
    
    elif pr_number == 87:
        return """## Revert Next.js 16.1.1 Dependency Update

### Description
This PR reverts the Next.js 16.1.1 dependency update (PR #9).

### Reason
The Next.js 16.1.1 update may have introduced compatibility issues or breaking changes that need to be addressed.

### Changes Made
- Reverted Next.js from 16.1.1 back to previous version
- Restored previous package.json and lock file state

### Action Required
- [ ] Review the reason for revert
- [ ] Determine if changes should be merged or PR closed
- [ ] Consider alternative approach if needed

### Related
- **Type**: Revert
- **Priority**: Medium
- **Related PR**: #9
- **Milestone**: v1.3 - Quality & Polish

### 🚀 Status
⏳ Awaiting review and decision
"""
    
    elif pr_number == 89:
        return """## 📝 Update .gitignore with Comprehensive Ignore Patterns

### Description
Updates `.gitignore` to include comprehensive ignore patterns for development artifacts and temporary files.

### Changes Made
- Enhanced `.gitignore` with additional ignore patterns:
  - Temporary files (*.tmp, *.bak, *.backup, *~)
  - IDE/editor files (.vscode/, .idea/, *.code-workspace)
  - OS files (Thumbs.db, .DS_Store variants)
  - PowerShell temporary files
  - Cache directories
  - Log files

### Impact
- Cleaner repository
- Prevents committing temporary files
- Better developer experience
- Reduces accidental commits of IDE/OS files

### Testing
- [ ] Verify .gitignore patterns work correctly
- [ ] Test with common development scenarios
- [ ] Ensure no important files are ignored

### Related
- **Type**: Maintenance / Configuration
- **Priority**: Low
- **Milestone**: v1.3 - Quality & Polish

### 🚀 Status
✅ Ready for review
"""
    
    # Default template for other PRs
    return f"""## Description

{current_body if current_body else "No description provided"}

### Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/formatting changes
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] ✅ Test additions/updates
- [ ] 🔧 Build/config changes

### Changes Made
- See commit history

### Testing
- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

### Related
- **Milestone**: v1.3 - Quality & Polish
- **Priority**: Medium

### 🚀 Status
⏳ Awaiting review
"""

def get_github_token() -> Optional[str]:
    """Get GitHub token from environment or gh CLI."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        # Try to get token from gh CLI
        try:
            result = subprocess.run(
                ['gh', 'auth', 'token'],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                token = result.stdout.strip()
        except:
            pass
    return token

def update_pr_description(pr_number: int, description: str) -> bool:
    """Update PR description using GitHub API."""
    try:
        token = get_github_token()
        if not token:
            print(f"  ⚠️  No GitHub token available for PR #{pr_number}", file=sys.stderr)
            return False
        
        import urllib.request
        import urllib.parse
        
        url = f"https://api.github.com/repos/{REPO}/pulls/{pr_number}"
        data = json.dumps({"body": description}).encode()
        
        req = urllib.request.Request(url, data=data, method="PATCH")
        req.add_header("Authorization", f"token {token}")
        req.add_header("Accept", "application/vnd.github.v3+json")
        req.add_header("Content-Type", "application/json")
        req.add_header("User-Agent", "PR-Description-Updater")
        
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                return True
            else:
                error_body = response.read().decode()
                print(f"  ⚠️  API returned status {response.status}: {error_body[:200]}", file=sys.stderr)
                return False
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"  ⚠️  HTTP Error {e.code}: {error_body[:200]}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"  ⚠️  Exception updating PR #{pr_number}: {e}", file=sys.stderr)
        return False

def main():
    """Main function to update all PR descriptions."""
    print("🔍 Fetching all open PRs...")
    
    # Get all open PRs
    result = subprocess.run(
        ['gh', 'pr', 'list', '--state', 'open', '--json', 'number,title,body'],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error fetching PRs: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    
    prs = json.loads(result.stdout)
    
    if not prs:
        print("No open PRs found")
        return
    
    print(f"Found {len(prs)} open PR(s)\n")
    print("=" * 60)
    
    updated = 0
    failed = 0
    
    for pr in prs:
        pr_number = pr.get("number")
        title = pr.get("title", "")
        current_body = pr.get("body", "")
        
        print(f"\n📝 Processing PR #{pr_number}: {title}")
        
        # Check if it's a dependency update PR
        dep_info = extract_dependency_info(title)
        
        if dep_info:
            new_description = generate_dependency_pr_description(dep_info, pr_number)
        else:
            new_description = generate_non_dependency_pr_description(pr_number, title, current_body)
        
        if update_pr_description(pr_number, new_description):
            print(f"  ✅ Successfully updated PR #{pr_number}")
            updated += 1
        else:
            print(f"  ❌ Failed to update PR #{pr_number}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"\n📊 Summary:")
    print(f"  ✅ Successfully updated: {updated} PR(s)")
    print(f"  ❌ Failed: {failed} PR(s)")
    print(f"  📋 Total processed: {len(prs)} PR(s)")

if __name__ == "__main__":
    main()
