#!/usr/bin/env python3
"""
Push PR #6 code fixes directly to the PR branch using GitHub API.
"""

import os
import sys
import base64
import requests
import subprocess
from typing import Optional

REPO = "benmed00/research-platform"
BRANCH = "dependabot/npm_and_yarn/hookform/resolvers-5.2.2"
BASE_URL = f"https://api.github.com/repos/{REPO}"

def get_github_token() -> Optional[str]:
    """Get GitHub token from environment or argument."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token and len(sys.argv) > 1:
        token = sys.argv[1]
    return token

def get_file_content(file_path: str, token: str, ref: str = None) -> dict:
    """Get file content from GitHub."""
    url = f"{BASE_URL}/contents/{file_path}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    params = {"ref": ref} if ref else {}
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    return {}

def update_file(file_path: str, content: str, message: str, token: str, sha: str = None, branch: str = None) -> bool:
    """Update file on GitHub."""
    url = f"{BASE_URL}/contents/{file_path}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # Encode content to base64
    content_b64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    
    data = {
        "message": message,
        "content": content_b64,
        "branch": branch or BRANCH
    }
    
    if sha:
        data["sha"] = sha
    
    response = requests.put(url, headers=headers, json=data)
    return response.status_code in [200, 201]

def get_local_file_content(file_path: str) -> Optional[str]:
    """Get file content from local commit."""
    try:
        result = subprocess.run(
            ["git", "show", f"274230d:{file_path}"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except:
        # Try reading from working directory
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        return None

def main():
    """Main function."""
    token = get_github_token()
    if not token:
        print("Error: GITHUB_TOKEN required", file=sys.stderr)
        sys.exit(1)
    
    files_to_update = [
        "src/lib/validations.ts",
        "src/app/dashboard/documents/new/page.tsx",
        "src/app/dashboard/documents/[id]/edit/page.tsx",
        "src/app/dashboard/publications/new/page.tsx",
        "src/app/dashboard/publications/[id]/edit/page.tsx",
    ]
    
    print(f"Updating files on branch: {BRANCH}")
    
    for file_path in files_to_update:
        print(f"\n[UPDATE] {file_path}...")
        
        # Get current file from branch
        current_file = get_file_content(file_path, token, BRANCH)
        if not current_file:
            print(f"  [SKIP] File not found or error reading from branch")
            continue
        
        sha = current_file.get("sha")
        
        # Get new content from our commit
        new_content = get_local_file_content(file_path)
        if not new_content:
            print(f"  [SKIP] Could not read new content")
            continue
        
        # Update file
        message = f"fix: resolve @hookform/resolvers v5 compatibility in {file_path}"
        if update_file(file_path, new_content, message, token, sha, BRANCH):
            print(f"  [SUCCESS] Updated successfully")
        else:
            print(f"  [FAILED] Update failed")
    
    print("\n[DONE] All files processed!")
    print("\nNote: If package-lock.json needs updating, run 'npm install' on the branch")

if __name__ == "__main__":
    main()
