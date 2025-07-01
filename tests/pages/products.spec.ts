import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Products/);
  });

  test('should display product list', async ({ page }) => {
    const productList = page.locator('div.product-list');
    await expect(productList).toBeVisible();
    const products = productList.locator('div.product-card');
    await expect(products).toHaveCount(12);
  });

  test('should filter products', async ({ page }) => {
    await page.selectOption('select[name="category"]', 'electronics');
    await expect(page.locator('div.product-card')).toHaveCount(6);
  });

  test('should sort products', async ({ page }) => {
    await page.selectOption('select[name="sort"]', 'price-desc');
    const prices = await page.locator('div.product-price').allTextContents();
    const sortedPrices = [...prices].sort((a, b) => parseFloat(b) - parseFloat(a));
    await expect(prices).toEqual(sortedPrices);
  });
});