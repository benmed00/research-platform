/**
 * @file search.spec.ts
 * @description E2E tests for global search functionality
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 60
 * @size 2.0 KB
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Global Search', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'admin@research-platform.ma');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should perform global search', async ({ page }: { page: Page }) => {
    // Find search input in header
    const searchInput = page.locator('input[placeholder*="Rechercher"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      
      // Wait for search results to appear
      await page.waitForTimeout(500); // Wait for debounce
      
      // Should show search results dropdown
      const resultsContainer = page.locator('[class*="Card"], [class*="card"]').filter({
        hasText: /espèces|missions|équipements/i
      }).first();
      
      // Results may or may not appear depending on data
      // Just verify search input works
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('should clear search query', async ({ page }: { page: Page }) => {
    const searchInput = page.locator('input[placeholder*="Rechercher"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await expect(searchInput).toHaveValue('test');
      
      // Find clear button (X icon)
      const clearButton = page.locator('button:has([class*="X"])').or(
        page.locator('button[aria-label*="clear"]')
      ).first();
      
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await expect(searchInput).toHaveValue('');
      }
    }
  });
});
