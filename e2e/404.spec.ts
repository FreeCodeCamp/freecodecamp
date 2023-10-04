import { test, expect, Page } from '@playwright/test';

test.describe('404 Page', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/404');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Should have a relevant page title', async () => {
    await expect(page).toHaveTitle('Page not found| freeCodeCamp');
  });

  test('Should display a message indicating a 404 error', async () => {
    await expect(
      page.locator("text=Page not found.")
    ).toBeVisible();
  });

  test('Should have a link to the homepage', async () => {
    const homepageLink = page.locator(
      '[data-playwright-test-label="homepage-link"]'
    );
    await expect(homepageLink).toBeVisible();
    await expect(homepageLink).toHaveText('Go to Homepage');
  });
});
