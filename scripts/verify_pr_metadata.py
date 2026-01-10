#!/usr/bin/env python3
"""
Verify all PR metadata: milestones, labels, assignees, related issues, workflows, and project board.
"""

import subprocess
import json
import sys

def get_all_prs():
    """Get all open PRs."""
    result = subprocess.run(
        ['gh', 'pr', 'list', '--state', 'open', '--json', 'number,title'],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        return json.loads(result.stdout)
    return []

def get_pr_details(pr_number):
    """Get detailed PR information."""
    result = subprocess.run(
        ['gh', 'pr', 'view', str(pr_number), '--json', 
         'number,title,milestone,labels,assignees,body,state,isDraft,mergeable,mergeableState'],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        return json.loads(result.stdout)
    return None

def check_related_issues(pr_body):
    """Extract related issues from PR body."""
    issues = []
    if pr_body:
        import re
        # Look for "Closes #", "Fixes #", "Related to #", etc.
        patterns = [
            r'(?:closes?|fixes?|resolves?|related to)\s*#(\d+)',
            r'#(\d+)'
        ]
        for pattern in patterns:
            matches = re.findall(pattern, pr_body, re.IGNORECASE)
            issues.extend(matches)
    return list(set(issues))

def get_check_runs(pr_number):
    """Get check run status for a PR."""
    result = subprocess.run(
        ['gh', 'api', f'repos/benmed00/research-platform/pulls/{pr_number}/checks'],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        data = json.loads(result.stdout)
        return data.get('check_runs', [])
    return []

def check_project_board(pr_number):
    """Check if PR is in project board."""
    # Try to find PR in project
    query = f"""
    query {{
      repository(owner: "benmed00", name: "research-platform") {{
        pullRequest(number: {pr_number}) {{
          projectItems(first: 10) {{
            nodes {{
              project {{
                title
                number
              }}
            }}
          }}
        }}
      }}
    }}
    """
    
    result = subprocess.run(
        ['gh', 'api', 'graphql', '-f', f'query={query}'],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        data = json.loads(result.stdout)
        projects = data.get('data', {}).get('repository', {}).get('pullRequest', {}).get('projectItems', {}).get('nodes', [])
        return [p['project']['title'] for p in projects if p.get('project')]
    return []

def main():
    """Main verification function."""
    print("🔍 Verifying PR Metadata...\n")
    print("=" * 80)
    
    prs = get_all_prs()
    
    if not prs:
        print("No open PRs found")
        return
    
    summary = {
        "total": len(prs),
        "with_milestone": 0,
        "with_labels": 0,
        "with_assignees": 0,
        "with_related_issues": 0,
        "in_project": 0,
        "checks_passing": 0,
        "checks_failing": 0,
        "checks_pending": 0
    }
    
    for pr in prs:
        pr_number = pr['number']
        pr_title = pr['title']
        
        print(f"\n📋 PR #{pr_number}: {pr_title}")
        print("-" * 80)
        
        details = get_pr_details(pr_number)
        if not details:
            print("  ⚠️  Could not fetch PR details")
            continue
        
        # Check milestone
        milestone = details.get('milestone')
        if milestone:
            print(f"  ✅ Milestone: {milestone['title']}")
            summary["with_milestone"] += 1
        else:
            print(f"  ❌ Milestone: Not set")
        
        # Check labels
        labels = details.get('labels', [])
        if labels:
            label_names = [l['name'] for l in labels]
            print(f"  ✅ Labels ({len(labels)}): {', '.join(label_names)}")
            summary["with_labels"] += 1
        else:
            print(f"  ❌ Labels: None")
        
        # Check assignees
        assignees = details.get('assignees', [])
        if assignees:
            assignee_names = [a['login'] for a in assignees]
            print(f"  ✅ Assignees: {', '.join(assignee_names)}")
            summary["with_assignees"] += 1
        else:
            print(f"  ❌ Assignees: None")
        
        # Check related issues
        pr_body = details.get('body', '')
        related_issues = check_related_issues(pr_body)
        if related_issues:
            print(f"  ✅ Related Issues: {', '.join(['#' + i for i in related_issues])}")
            summary["with_related_issues"] += 1
        else:
            print(f"  ℹ️  Related Issues: None found in description")
        
        # Check project board
        projects = check_project_board(pr_number)
        if projects:
            print(f"  ✅ In Project: {', '.join(projects)}")
            summary["in_project"] += 1
        else:
            print(f"  ⚠️  Project Board: Not found (may need manual check)")
        
        # Check workflow status
        mergeable_state = details.get('mergeableState', 'unknown')
        print(f"  ℹ️  Mergeable State: {mergeable_state}")
        
        # Check runs
        check_runs = get_check_runs(pr_number)
        if check_runs:
            passing = sum(1 for cr in check_runs if cr.get('conclusion') == 'success')
            failing = sum(1 for cr in check_runs if cr.get('conclusion') == 'failure')
            pending = sum(1 for cr in check_runs if cr.get('status') != 'completed')
            
            print(f"  📊 Checks: {passing} passing, {failing} failing, {pending} pending")
            
            if failing == 0 and pending == 0:
                summary["checks_passing"] += 1
            elif failing > 0:
                summary["checks_failing"] += 1
            else:
                summary["checks_pending"] += 1
        else:
            print(f"  ℹ️  Checks: No check runs found")
    
    # Print summary
    print("\n" + "=" * 80)
    print("\n📊 Summary:")
    print(f"  Total PRs: {summary['total']}")
    print(f"  ✅ With Milestone: {summary['with_milestone']}/{summary['total']}")
    print(f"  ✅ With Labels: {summary['with_labels']}/{summary['total']}")
    print(f"  ✅ With Assignees: {summary['with_assignees']}/{summary['total']}")
    print(f"  ✅ With Related Issues: {summary['with_related_issues']}/{summary['total']}")
    print(f"  ✅ In Project Board: {summary['in_project']}/{summary['total']}")
    print(f"  ✅ Checks Passing: {summary['checks_passing']}/{summary['total']}")
    print(f"  ❌ Checks Failing: {summary['checks_failing']}/{summary['total']}")
    print(f"  ⏳ Checks Pending: {summary['checks_pending']}/{summary['total']}")

if __name__ == '__main__':
    main()
