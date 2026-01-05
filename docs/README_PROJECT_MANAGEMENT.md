# 📋 Research Platform - Project Management Guide

This document provides a quick reference for managing the Research Platform project using GitHub's project management features.

---

## 🎯 Project Overview

**Repository**: https://github.com/benmed00/research-platform  
**Project Board**: https://github.com/benmed00/research-platform/projects/5  
**Milestones**: https://github.com/benmed00/research-platform/milestones  
**Issues**: https://github.com/benmed00/research-platform/issues

---

## 📊 Current Status

### Milestones Progress

- **v1.0 - Production Foundation**: 7 tasks (Due: 2025-02-28)
- **v1.1 - Performance & User Experience**: 19 tasks (Due: 2025-05-31)
- **v1.2 - Advanced Features & Integration**: 4 tasks (Due: 2025-08-31)
- **v1.3 - Quality & Polish**: 7 tasks (Due: 2025-11-30)
- **v2.0 - Advanced Platform Vision**: Future planning (Due: 2026-01-31)

**Total Tasks**: 37 tasks with milestones (+ additional tasks)

---

## 🏷️ Label System

### Priority Labels
- `priority:high` - Must be completed soon
- `priority:medium` - Important but can wait
- `priority:low` - Nice to have

### Type Labels
- `type:feature` - New feature
- `type:enhancement` - Improvement to existing feature
- `type:bug` - Bug fix
- `type:performance` - Performance improvement
- `type:documentation` - Documentation work
- `type:security` - Security-related
- `type:testing` - Testing work

### Module Labels
- `module:users` - User management
- `module:hr` - Human resources
- `module:finance` - Finance & accounting
- `module:equipment` - Equipment & logistics
- `module:missions` - Missions & campaigns
- `module:species` - Species database
- `module:environment` - Environmental data
- `module:gis` - GIS & mapping
- `module:documents` - Document management
- `module:publications` - Publications

---

## 📋 Project Board Columns

### Todo
High-priority tasks ready to start. Focus on v1.0 and critical v1.1 tasks.

**Recommended**: ~20 tasks

### In Progress
Tasks currently being worked on. Move tasks here when you start working.

**Recommended**: 2-5 tasks at a time

### Done
Completed tasks. Move here when work is finished and reviewed.

### Backlog
Future work and lower-priority tasks. Includes v1.2, v1.3, and medium/low priority v1.1 tasks.

**Recommended**: ~15 tasks

---

## 🔍 Recommended Views

### 1. By Milestone View
**Purpose**: See progress toward each milestone goal

**Setup:**
- Group by: Milestone
- Sort by: Due date
- Filter: None

### 2. By Status View (Default Kanban)
**Purpose**: Track workflow progress

**Setup:**
- Use default board view
- Shows: Todo → In Progress → Done → Backlog

### 3. By Priority View
**Purpose**: Focus on high-priority work

**Setup:**
- Group by: Label (priority:*)
- Filter: Label contains "priority:"
- Sort by: Priority

### 4. By Module View
**Purpose**: Organize by platform modules

**Setup:**
- Group by: Label (module:*)
- Filter: Label contains "module:"
- Sort by: Module name

---

## 🚀 Getting Started

### For Developers

1. **Pick a task from Todo**
   - Look for `priority:high` tasks
   - Start with v1.0 tasks for production readiness
   - Check milestone due dates

2. **Move to In Progress**
   - Drag the task to In Progress column
   - Or use the status field on the issue

3. **Create a branch**
   ```bash
   git checkout -b feature/issue-22-security-audit
   ```

4. **Work on the task**
   - Follow the task description
   - Check acceptance criteria
   - Update progress

5. **Create Pull Request**
   - Link PR to the issue
   - PR will automatically link to milestone
   - Add appropriate labels

6. **Move to Done**
   - After PR is merged
   - Or mark issue as complete
   - Update project board

---

## 📈 Tracking Progress

### Milestone Progress
- View on milestone page
- See percentage complete
- Track open vs closed issues
- Monitor due dates

### Project Board Progress
- Count items in each column
- See workflow bottlenecks
- Track completion rate
- Identify blockers

### Labels Usage
- Filter by label to see specific types
- Group by label in views
- Track module-specific work
- Identify priority distribution

---

## 💡 Best Practices

1. **Keep Todo focused** - Only high-priority, ready-to-start tasks
2. **Limit In Progress** - 2-5 tasks maximum to avoid context switching
3. **Regular updates** - Move tasks as work progresses
4. **Link PRs to issues** - Use "Closes #XX" in PR description
5. **Use labels consistently** - Apply appropriate labels to all issues
6. **Update milestones** - Adjust due dates if needed
7. **Review regularly** - Weekly milestone and board review

---

## 🔗 Quick Commands

### View Issues
```bash
# All open issues
gh issue list --repo benmed00/research-platform

# Issues by milestone
gh issue list --repo benmed00/research-platform --milestone "v1.0 - Production Foundation"

# Issues by label
gh issue list --repo benmed00/research-platform --label "priority:high"
```

### Create Issue
```bash
gh issue create \
  --title "Task title" \
  --body "Task description" \
  --milestone "v1.0 - Production Foundation" \
  --label "type:feature,priority:high,module:users"
```

### View Milestones
```bash
gh api repos/benmed00/research-platform/milestones
```

---

## 📚 Documentation Reference

- **Setup Summary**: `FINAL_PROJECT_SETUP_SUMMARY.md`
- **Organization Guide**: `PROJECT_BOARD_ORGANIZATION.md`
- **Quick Start**: `QUICK_START_PROJECT_BOARD.md`
- **Task Lists**: `PROJECT_INITIAL_TASKS.md`
- **Milestones**: `GITHUB_MILESTONES_AND_PROJECT.md`

---

**Happy coding! 🚀**

