import { test, expect } from '@playwright/test';

test.describe('Account Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/account');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/My Account/);
  });

  test('should display user information', async ({ page }) => {
    await expect(page.locator('div.user-info')).toBeVisible();
  });

  test('should allow updating profile', async ({ page }) => {
    const nameField = page.locator('input[name="name"]');
    await nameField.fill('New Name');
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});