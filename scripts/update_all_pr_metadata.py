#!/usr/bin/env python3
"""
Update all PR metadata: milestones, labels, assignees, project board status, and check workflows.
"""

import os
import sys
import json
import subprocess
import urllib.request
import urllib.parse
from typing import Dict, List, Optional

REPO = "benmed00/research-platform"
MILESTONE_NUMBER = 4  # v1.3 - Quality & Polish
MILESTONE_NAME = "v1.3 - Quality & Polish"
PROJECT_ID = "PVT_kwHOAQ9qLM4BL0uO"  # Research Platform Development
BASE_URL = f"https://api.github.com/repos/{REPO}"

def get_github_token() -> Optional[str]:
    """Get GitHub token from environment."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        # Try to get from gh CLI
        try:
            result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
            if result.returncode == 0:
                token = result.stdout.strip()
        except:
            pass
    return token

def api_request(endpoint: str, method: str = "GET", data: Dict = None, token: str = None) -> Dict:
    """Make a GitHub API request."""
    if not token:
        token = get_github_token()
    
    url = f"{BASE_URL}/{endpoint}" if not endpoint.startswith('http') else endpoint
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "PR-Metadata-Updater"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    
    try:
        if method == "GET":
            req = urllib.request.Request(url, headers=headers)
        else:
            req = urllib.request.Request(url, headers=headers, method=method)
            if data:
                req.add_header("Content-Type", "application/json")
                req.data = json.dumps(data).encode()
        
        with urllib.request.urlopen(req) as response:
            if response.status == 204:  # No content
                return {}
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {"error": f"HTTP {e.code}: {error_body}"}
    except Exception as e:
        return {"error": str(e)}

def get_pr_metadata(pr_number: int, token: str) -> Dict:
    """Get PR metadata including labels, milestone, assignees."""
    return api_request(f"pulls/{pr_number}", token=token)

def set_milestone(pr_number: int, milestone_number: int, token: str) -> bool:
    """Set milestone for a PR."""
    data = {"milestone": milestone_number}
    result = api_request(f"issues/{pr_number}", method="PATCH", data=data, token=token)
    return "error" not in result

def add_labels(pr_number: int, labels: List[str], token: str) -> bool:
    """Add labels to a PR."""
    # Get current labels
    pr_data = get_pr_metadata(pr_number, token)
    current_labels = [label["name"] for label in pr_data.get("labels", [])]
    
    # Add new labels that don't exist
    labels_to_add = [l for l in labels if l not in current_labels]
    if not labels_to_add:
        return True
    
    data = {"labels": current_labels + labels_to_add}
    result = api_request(f"issues/{pr_number}", method="PATCH", data=data, token=token)
    return "error" not in result

def add_assignee(pr_number: int, assignee: str, token: str) -> bool:
    """Add assignee to a PR."""
    data = {"assignees": [assignee]}
    result = api_request(f"issues/{pr_number}/assignees", method="POST", data=data, token=token)
    return "error" not in result

def get_pr_labels_for_type(pr_title: str, pr_number: int) -> List[str]:
    """Determine appropriate labels based on PR type."""
    title_lower = pr_title.lower()
    labels = []
    
    # Type labels
    if "deps" in title_lower or "bump" in title_lower:
        labels.append("type:maintenance")
    elif "fix" in title_lower:
        labels.append("type:bug")
    elif "revert" in title_lower:
        labels.append("type:maintenance")
    else:
        labels.append("type:maintenance")
    
    # Priority labels
    if pr_number in [85, 86]:
        labels.append("priority:low")
    elif any(x in title_lower for x in ["major", "breaking", "security"]):
        labels.append("priority:high")
    elif any(x in title_lower for x in ["minor", "patch"]):
        labels.append("priority:low")
    else:
        labels.append("priority:medium")
    
    # Module labels
    if "action" in title_lower or "workflow" in title_lower or ("ci" in title_lower and "fix" in title_lower):
        labels.append("module:ci")
    elif any(x in title_lower for x in ["node", "types/node"]):
        labels.append("module:frontend")
    elif any(x in title_lower for x in ["bcrypt", "security"]):
        labels.append("module:security")
    elif any(x in title_lower for x in ["tailwind", "lucide", "react"]):
        labels.append("module:frontend")
    elif any(x in title_lower for x in ["date", "fns"]):
        labels.append("module:core")
    elif "gitignore" in title_lower:
        labels.append("module:core")
    elif "codeql" in title_lower:
        labels.append("module:security")
    else:
        labels.append("module:core")
    
    return labels

def add_to_project(pr_number: int, project_id: str, token: str) -> bool:
    """Add PR to project board using GraphQL."""
    # Get PR node ID
    query = f"""
    query {{
      repository(owner: "benmed00", name: "research-platform") {{
        pullRequest(number: {pr_number}) {{
          id
        }}
      }}
    }}
    """
    
    mutation = f"""
    mutation {{
      addProjectV2ItemById(input: {{
        projectId: "{project_id}",
        contentId: "$PR_NODE_ID"
      }}) {{
        item {{
          id
        }}
      }}
    }}
    """
    
    # First get PR node ID
    graphql_data = {
        "query": query
    }
    
    try:
        url = "https://api.github.com/graphql"
        headers = {
            "Authorization": f"token {token}",
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
        }
        
        req = urllib.request.Request(url, headers=headers, method="POST")
        req.data = json.dumps(graphql_data).encode()
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            pr_node_id = result.get("data", {}).get("repository", {}).get("pullRequest", {}).get("id")
            
            if not pr_node_id:
                return False
            
            # Now add to project
            mutation = mutation.replace("$PR_NODE_ID", pr_node_id)
            graphql_data = {"query": mutation}
            
            req = urllib.request.Request(url, headers=headers, method="POST")
            req.data = json.dumps(graphql_data).encode()
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                return "errors" not in result or len(result.get("errors", [])) == 0
    except Exception as e:
        print(f"  ⚠️  Project update error: {e}")
        return False

def check_workflow_status(pr_number: int, token: str) -> Dict:
    """Check workflow/check status for a PR."""
    result = api_request(f"pulls/{pr_number}", token=token)
    if "error" in result:
        return {}
    
    # Get check runs
    check_runs = api_request(f"pulls/{pr_number}/checks", token=token)
    
    status = {
        "state": result.get("mergeable_state", "unknown"),
        "checks": check_runs.get("check_runs", []),
        "statuses": result.get("statuses_url", "")
    }
    
    return status

def update_pr_metadata(pr_number: int, pr_title: str, token: str) -> Dict:
    """Update all metadata for a PR."""
    results = {
        "milestone": False,
        "labels": False,
        "assignee": False,
        "project": False,
        "workflow": {}
    }
    
    print(f"\n📋 Updating PR #{pr_number}: {pr_title}")
    
    # Set milestone
    print("  🎯 Setting milestone...")
    if set_milestone(pr_number, MILESTONE_NUMBER, token):
        print(f"    ✅ Milestone set: {MILESTONE_NAME}")
        results["milestone"] = True
    else:
        print(f"    ⚠️  Failed to set milestone")
    
    # Add labels
    print("  🏷️  Adding labels...")
    labels = get_pr_labels_for_type(pr_title, pr_number)
    if add_labels(pr_number, labels, token):
        print(f"    ✅ Labels added: {', '.join(labels)}")
        results["labels"] = True
    else:
        print(f"    ⚠️  Failed to add some labels")
    
    # Add assignee
    print("  👤 Adding assignee...")
    if add_assignee(pr_number, "benmed00", token):
        print(f"    ✅ Assignee set: benmed00")
        results["assignee"] = True
    else:
        print(f"    ⚠️  Failed to set assignee (may already be assigned)")
    
    # Add to project (optional, may fail if already added)
    print("  📊 Adding to project board...")
    try:
        if add_to_project(pr_number, PROJECT_ID, token):
            print(f"    ✅ Added to project board")
            results["project"] = True
        else:
            print(f"    ⚠️  May already be in project or needs manual addition")
    except Exception as e:
        print(f"    ⚠️  Project update skipped: {e}")
    
    # Check workflow status
    print("  🔍 Checking workflow status...")
    workflow_status = check_workflow_status(pr_number, token)
    if workflow_status:
        state = workflow_status.get("state", "unknown")
        print(f"    ℹ️  Mergeable state: {state}")
        results["workflow"] = workflow_status
    
    return results

def main():
    """Main function."""
    token = get_github_token()
    if not token:
        print("❌ GITHUB_TOKEN not found", file=sys.stderr)
        sys.exit(1)
    
    print("🔍 Fetching all open PRs...")
    
    # Get all open PRs
    result = subprocess.run(
        ['gh', 'pr', 'list', '--state', 'open', '--json', 'number,title'],
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
    
    success_count = {
        "milestone": 0,
        "labels": 0,
        "assignee": 0,
        "project": 0
    }
    
    for pr in prs:
        pr_number = pr.get("number")
        pr_title = pr.get("title", "")
        
        results = update_pr_metadata(pr_number, pr_title, token)
        
        if results["milestone"]:
            success_count["milestone"] += 1
        if results["labels"]:
            success_count["labels"] += 1
        if results["assignee"]:
            success_count["assignee"] += 1
        if results["project"]:
            success_count["project"] += 1
    
    print("\n" + "=" * 60)
    print("\n📊 Summary:")
    print(f"  ✅ Milestones set: {success_count['milestone']}/{len(prs)}")
    print(f"  ✅ Labels added: {success_count['labels']}/{len(prs)}")
    print(f"  ✅ Assignees set: {success_count['assignee']}/{len(prs)}")
    print(f"  ✅ Project board: {success_count['project']}/{len(prs)}")
    print(f"  📋 Total PRs processed: {len(prs)}")

if __name__ == "__main__":
    main()
