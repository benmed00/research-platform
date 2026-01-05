# Testing Guidelines

## Overview

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing.

## Test Structure

```
src/
├── lib/
│   ├── utils.test.ts          # Unit tests for utilities
│   └── rate-limit.test.ts     # Unit tests for rate limiting
├── components/
│   └── ui/
│       └── button.test.tsx    # Component tests
└── test/
    └── setup.ts               # Test setup and configuration
```

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Writing Tests

### Unit Tests

Test utility functions and pure logic:

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toContain("2024");
  });
});
```

### Component Tests

Test React components with React Testing Library:

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component/function does, not how
2. **Use descriptive test names** - Test names should clearly describe what is being tested
3. **Keep tests isolated** - Each test should be independent
4. **Test edge cases** - Include tests for error conditions and boundary cases
5. **Maintain test coverage** - Aim for 80% coverage on critical paths

## Coverage Goals

- **Critical paths**: 80%+ coverage
- **Utilities**: 90%+ coverage
- **Components**: 70%+ coverage
- **API routes**: 60%+ coverage (integration tests)

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Coverage reports are generated and uploaded

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

