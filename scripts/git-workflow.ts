/**
 * @file git-workflow.ts
 * @description scripts/git-workflow.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 240
 * @size 6.60 KB
 */
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const exec = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

interface CommitGroup {
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'chore';
  files: string[];
  message: string;
}

class GitWorkflow {
  async getChangedFiles(): Promise<string[]> {
    try {
      const output = await exec('git diff --cached --name-only');
      if (!output) return [];
      return output.split('\n').filter(f => f.trim());
    } catch {
      return [];
    }
  }

  async getUnstagedFiles(): Promise<string[]> {
    try {
      const output = await exec('git diff --name-only');
      if (!output) return [];
      return output.split('\n').filter(f => f.trim());
    } catch {
      return [];
    }
  }

  async getUntrackedFiles(): Promise<string[]> {
    try {
      const output = await exec('git ls-files --others --exclude-standard');
      if (!output) return [];
      return output.split('\n').filter(f => f.trim());
    } catch {
      return [];
    }
  }

  async groupFilesByType(files: string[]): Promise<Map<string, string[]>> {
    const groups = new Map<string, string[]>();

    files.forEach(file => {
      let type = 'chore';
      
      if (file.includes('/api/')) {
        type = 'feat';
      } else if (file.includes('/components/')) {
        type = 'feat';
      } else if (file.includes('/lib/')) {
        type = 'refactor';
      } else if (file.includes('/hooks/')) {
        type = 'feat';
      } else if (file.includes('test') || file.includes('spec')) {
        type = 'test';
      } else if (file.includes('.md') || file.includes('docs/')) {
        type = 'docs';
      } else if (file.includes('prisma/')) {
        type = 'chore';
      }

      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(file);
    });

    return groups;
  }

  async createBranch(branchName: string, baseBranch: string = 'main'): Promise<void> {
    try {
      await exec(`git checkout ${baseBranch}`);
      await exec(`git pull origin ${baseBranch}`);
      await exec(`git checkout -b ${branchName}`);
      console.log(`✓ Created and switched to branch: ${branchName}`);
    } catch (error) {
      throw new Error(`Failed to create branch: ${error}`);
    }
  }

  async stageFiles(files: string[]): Promise<void> {
    if (files.length === 0) return;
    await exec(`git add ${files.join(' ')}`);
  }

  async createCommit(type: string, message: string, files: string[]): Promise<void> {
    if (files.length === 0) {
      console.log('No files to commit');
      return;
    }

    await this.stageFiles(files);
    const commitMessage = `${type}: ${message}`;
    await exec(`git commit -m "${commitMessage}"`);
    console.log(`✓ Committed: ${commitMessage} (${files.length} files)`);
  }

  async createMultipleCommits(groups: CommitGroup[]): Promise<void> {
    for (const group of groups) {
      await this.createCommit(group.type, group.message, group.files);
    }
  }

  async pushBranch(branchName: string): Promise<void> {
    await exec(`git push -u origin ${branchName}`);
    console.log(`✓ Pushed branch: ${branchName}`);
  }

  async generatePRDescription(branchName: string): Promise<string> {
    const commits = await exec(`git log origin/main..${branchName} --oneline`);
    const changedFiles = await exec(`git diff origin/main..${branchName} --stat`);
    
    return `## Pull Request: ${branchName}

### Description
This PR includes the following changes:

### Commits
\`\`\`
${commits}
\`\`\`

### Files Changed
\`\`\`
${changedFiles}
\`\`\`

### Checklist
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
`;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const workflow = new GitWorkflow();

  try {
    switch (command) {
      case 'branch':
        const branchName = args[1];
        if (!branchName) {
          console.error('Usage: ts-node git-workflow.ts branch <branch-name>');
          process.exit(1);
        }
        await workflow.createBranch(branchName);
        break;

      case 'commit-grouped':
        const unstaged = await workflow.getUnstagedFiles();
        const untracked = await workflow.getUntrackedFiles();
        const allFiles = [...unstaged, ...untracked];
        
        if (allFiles.length === 0) {
          console.log('No files to commit');
          break;
        }

        const groups = await workflow.groupFilesByType(allFiles);
        const commitGroups: CommitGroup[] = [];

        groups.forEach((files, type) => {
          const category = type === 'feat' ? 'API/Components' : 
                          type === 'refactor' ? 'Library updates' :
                          type === 'docs' ? 'Documentation' : 'Other';
          commitGroups.push({
            type: type as any,
            files,
            message: `Update ${category.toLowerCase()}`
          });
        });

        await workflow.createMultipleCommits(commitGroups);
        break;

      case 'push':
        const currentBranch = await exec('git rev-parse --abbrev-ref HEAD');
        await workflow.pushBranch(currentBranch);
        break;

      case 'pr-desc':
        const branch = args[1] || await exec('git rev-parse --abbrev-ref HEAD');
        const desc = await workflow.generatePRDescription(branch);
        console.log(desc);
        break;

      default:
        console.log(`
Git Workflow Helper

Usage:
  ts-node git-workflow.ts branch <name>        Create a new branch
  ts-node git-workflow.ts commit-grouped       Create multiple coherent commits
  ts-node git-workflow.ts push                 Push current branch
  ts-node git-workflow.ts pr-desc [branch]     Generate PR description
        `);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { GitWorkflow };

