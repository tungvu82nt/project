import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/About Us/);
  });

  test('should display main sections', async ({ page }) => {
    await expect(page.locator('section.mission')).toBeVisible();
    await expect(page.locator('section.team')).toBeVisible();
    await expect(page.locator('section.history')).toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.locator('div.contact-info')).toBeVisible();
  });
});