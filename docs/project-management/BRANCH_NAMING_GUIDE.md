# Branch Naming Convention

## Standard Pattern

All feature and development branches should follow the pattern:

```
yakov/<branch-name>
```

## Examples

✅ **Correct**:
- `yakov/feature-global-search`
- `yakov/fix-auth-bug`
- `yakov/refactor-api-routes`
- `yakov/cloud-agent-1768077225474-mzivf`

❌ **Incorrect**:
- `cursor/feature-global-search` (old pattern, deprecated)
- `feature-global-search` (missing prefix)
- `main-feature` (not following convention)

## Branch Types

### Feature Branches
```
yakov/feature-<description>
```
Example: `yakov/feature-user-dashboard`

### Bug Fix Branches
```
yakov/fix-<description>
```
Example: `yakov/fix-login-error`

### Refactoring Branches
```
yakov/refactor-<description>
```
Example: `yakov/refactor-api-structure`

### Documentation Branches
```
yakov/docs-<description>
```
Example: `yakov/docs-api-documentation`

### Chore/Maintenance Branches
```
yakov/chore-<description>
```
Example: `yakov/chore-update-dependencies`

## Migration from `cursor/*`

All branches previously using the `cursor/*` pattern have been migrated to `yakov/*`. 

**Action Required**: When creating new branches, always use the `yakov/*` prefix.

## Best Practices

1. **Use descriptive names**: Branch names should clearly indicate their purpose
2. **Use kebab-case**: Separate words with hyphens
3. **Keep it concise**: Aim for 3-5 words maximum
4. **Include issue numbers**: If applicable, include issue number: `yakov/feature-123-user-authentication`
5. **Avoid special characters**: No spaces, underscores (use hyphens), or special characters

## Enforcement

- All new branches should follow this convention
- Pull requests from branches not following this convention may be rejected
- CI/CD workflows may check branch naming patterns

## Related Documentation

- See `BRANCH_PROTECTION_RULES.md` for branch protection settings
- See `MERGE_STRATEGY.md` for merge guidelines
