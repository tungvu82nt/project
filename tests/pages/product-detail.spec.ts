import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product/123');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Product Details/);
  });

  test('should display product information', async ({ page }) => {
    await expect(page.locator('div.product-info')).toBeVisible();
    await expect(page.locator('div.product-price')).toBeVisible();
    await expect(page.locator('div.product-description')).toBeVisible();
  });

  test('should add to cart', async ({ page }) => {
    await page.click('button.add-to-cart');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should change quantity', async ({ page }) => {
    const quantityInput = page.locator('input[name="quantity"]');
    await quantityInput.fill('2');
    await expect(quantityInput).toHaveValue('2');
  });
});