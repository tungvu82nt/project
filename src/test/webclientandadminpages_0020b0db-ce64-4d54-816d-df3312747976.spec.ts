
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('WebClientAndAdminPages_2025-06-30', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173/');

    // Navigate to URL
    await page.goto('http://localhost:5173/products');

    // Navigate to URL
    await page.goto('http://localhost:5173/about');

    // Navigate to URL
    await page.goto('http://localhost:5173/contact');

    // Navigate to URL
    await page.goto('http://localhost:5173/cart');

    // Navigate to URL
    await page.goto('http://localhost:5173/checkout');

    // Navigate to URL
    await page.goto('http://localhost:5173/account');

    // Navigate to URL
    await page.goto('http://localhost:5173/productdetail');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/products');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/categories');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/orders');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/customers');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/analytics');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/content');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/marketing');

    // Navigate to URL
    await page.goto('http://localhost:5173/admin/settings');
});