import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Shopping Cart/);
  });

  test('should display cart items', async ({ page }) => {
    await expect(page.locator('div.cart-item')).toBeVisible();
  });

  test('should update quantity', async ({ page }) => {
    const quantityInput = page.locator('input[name="quantity"]');
    await quantityInput.fill('2');
    await page.click('button.update-quantity');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should remove item', async ({ page }) => {
    const initialCount = await page.locator('div.cart-item').count();
    await page.click('button.remove-item');
    const finalCount = await page.locator('div.cart-item').count();
    await expect(finalCount).toBeLessThan(initialCount);
  });
});