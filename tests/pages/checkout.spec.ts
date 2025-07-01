import { test, expect } from '@playwright/test';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Checkout/);
  });

  test('should display shipping information form', async ({ page }) => {
    await expect(page.locator('form.shipping-info')).toBeVisible();
  });

  test('should process payment', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="address"]', '123 Main St');
    await page.selectOption('select[name="paymentMethod"]', 'credit-card');
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
  });
});