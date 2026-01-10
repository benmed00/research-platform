#!/usr/bin/env python3
"""
Automated PR Creation Script
Usage: GITHUB_TOKEN=your_token python3 auto_create_pr.py
"""
import os
import json
import sys
import subprocess
import urllib.request
import urllib.error

def get_token():
    """Get token from environment or git remote"""
    # First try environment variable
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        return token
    
    # Try git remote
    try:
        result = subprocess.run(['git', 'remote', 'get-url', 'origin'], 
                              capture_output=True, text=True, check=True)
        remote_url = result.stdout.strip()
        if 'x-access-token:' in remote_url:
            token = remote_url.split('x-access-token:')[1].split('@')[0]
            return token
    except:
        pass
    
    return None

def create_pr():
    """Create the pull request"""
    token = get_token()
    if not token:
        print("❌ Error: GITHUB_TOKEN not found")
        print("Set it via: export GITHUB_TOKEN=your_token")
        return False
    
    repo = "benmed00/research-platform"
    title = "feat: Implement Critical Priorities - Testing, Performance, Security, Export & Search"
    head = "yakov/critical-priorities-implementation"
    base = "main"
    
    # Read PR description
    try:
        with open('PR_DESCRIPTION.md', 'r', encoding='utf-8') as f:
            body = f.read()
    except FileNotFoundError:
        print("❌ Error: PR_DESCRIPTION.md not found")
        return False
    
    # Create PR request
    data = {
        "title": title,
        "head": head,
        "base": base,
        "body": body
    }
    
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/pulls",
        data=json.dumps(data).encode('utf-8'),
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "PR-Auto-Creator"
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            pr_url = result['html_url']
            pr_number = result['number']
            
            print("✅ Pull Request created successfully!")
            print(f"📝 PR #{pr_number}: {pr_url}")
            
            # Save PR URL
            with open('.pr_url', 'w') as f:
                f.write(pr_url)
            
            return True
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            error_data = json.loads(error_body)
            error_msg = error_data.get('message', 'Unknown error')
        except:
            error_msg = error_body
        
        print(f"❌ Failed to create PR (HTTP {e.code})")
        print(f"Error: {error_msg}")
        
        if e.code == 403:
            print("\n💡 The token needs 'repo' scope permissions.")
            print("   Create a Personal Access Token with 'repo' scope at:")
            print("   https://github.com/settings/tokens")
            print("\n   Then run: GITHUB_TOKEN=your_token python3 auto_create_pr.py")
        
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = create_pr()
    sys.exit(0 if success else 1)
