# Markdown Style Guide

This document outlines the Markdown formatting rules enforced in this project. All `.md` files must follow these guidelines.

## Configuration

The project uses `.markdownlint.json` for linting rules and `.vscode/settings.json` for editor integration.

## Key Rules

### MD032: Lists should be surrounded by blank lines
- **Rule**: Lists must have blank lines before and after them
- **Example**:
  ```markdown
  **Tasks**:
  
  - Task 1
  - Task 2
  ```

### MD022: Headings should be surrounded by blank lines
- **Rule**: Headings must have blank lines before and after them
- **Example**:
  ```markdown
  Some text here.

  ## Heading

  More content here.
  ```

### MD040: Fenced code blocks should have a language specified
- **Rule**: All code blocks must specify a language
- **Example**:
  ```markdown
  ```typescript
  const code = "here";
  ```
  ```

### MD012: Multiple consecutive blank lines
- **Rule**: Maximum of 1 consecutive blank line
- **Example**: Use single blank lines, not multiple

### MD024: No duplicate headings
- **Rule**: Headings with the same content should be unique (siblings only)
- **Example**: Use descriptive, unique headings

### MD031: Fenced code blocks should be surrounded by blank lines
- **Rule**: Code blocks need blank lines before and after
- **Example**:
  ```markdown
  Some text.

  ```code
  ```

  More text.
  ```

## Common Patterns

### Lists after labels
Always add a blank line between labels and lists:

```markdown
**Tasks**:

- Task 1
- Task 2

**Acceptance Criteria**:

- Criterion 1
- Criterion 2
```

### Headings followed by content
Always add a blank line after headings:

```markdown
## Section Title

Content starts here.
```

### Code blocks
Always specify language and surround with blank lines:

```markdown
Here's some code:

```typescript
const example = "code";
```

More content.
```

## VS Code Integration

If using VS Code, install the "Markdownlint" extension by David Anson. The project settings will automatically apply these rules.

## Validation

To check all Markdown files for violations, use your editor's linting feature or run:

```bash
# If markdownlint-cli is installed
npx markdownlint-cli "**/*.md"
```

## References

- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [VS Code Markdownlint Extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)

