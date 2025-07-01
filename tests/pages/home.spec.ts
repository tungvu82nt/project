import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/);
  });

  test('should display main sections', async ({ page }) => {
    await expect(page.locator('section.hero')).toBeVisible();
    await expect(page.locator('section.products')).toBeVisible();
    await expect(page.locator('section.newsletter')).toBeVisible();
  });

  test('should navigate to product detail', async ({ page }) => {
    const productCard = page.locator('div.product-card').first();
    await productCard.click();
    await expect(page.url()).toContain('/product/');
  });
});