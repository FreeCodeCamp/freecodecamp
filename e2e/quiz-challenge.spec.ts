import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';

test.describe('Quiz challenge', () => {
  test.skip(
    () => process.env.SHOW_UPCOMING_CHANGES !== 'true',
    'The FSD superblock is not available if SHOW_UPCOMING_CHANGES is false'
  );

  test.use({ storageState: 'playwright/.auth/development-user.json' });

  test.beforeEach(async ({ page }) => {
    execSync('node ./tools/scripts/seed/seed-demo-user');

    await page.goto(
      '/learn/full-stack-developer/quiz-basic-html/quiz-basic-html'
    );
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test('should display a list of unanswered questions if user has not answered all questions', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    for (let i = 0; i < 15; i++) {
      const radioGroups = await page.getByRole('radiogroup').all();
      await radioGroups[i].getByRole('radio').first().click();
    }

    await page.getByRole('button', { name: 'Finish the quiz' }).click();

    await expect(
      page.getByText(
        'The following questions are unanswered: 16, 17, 18, 19, 20. You must answer all questions.'
      )
    ).toBeVisible();
  });

  test('should show a confirm finish modal when user clicks the finish button, and disable the quiz once they have confirmed', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    const radioGroups = await page.getByRole('radiogroup').all();

    for (const radioGroup of radioGroups) {
      await radioGroup.getByRole('radio').first().click();
    }

    await page.getByRole('button', { name: 'Finish the quiz' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Finish Quiz' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Yes, I am finished' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Finish Quiz' })
    ).toBeHidden();

    const radios = await page.getByRole('radio').all();

    for (const radio of radios) {
      await expect(radio).toBeDisabled();
    }
  });

  test('should show a confirm exit modal when user clicks on the exit button', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    await page.getByRole('button', { name: 'Exit the quiz' }).click();

    // The navigation should be blocked, the user should stay on the same page
    await expect(page).toHaveURL(
      '/learn/full-stack-developer/quiz-basic-html/quiz-basic-html'
    );

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeVisible();

    await page
      .getByRole('button', { name: 'No, I would like to continue the quiz' })
      .click();
    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeHidden();

    await page.getByRole('button', { name: 'Exit the quiz' }).click();
    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeVisible();
    await page
      .getByRole('button', { name: 'Yes, I want to leave the quiz' })
      .click();

    await page.waitForURL('/learn/full-stack-developer/#quiz-basic-html');
    await expect(
      page.getByRole('heading', { level: 3, name: 'Basic HTML Quiz' })
    ).toBeVisible();
  });

  test('should show a confirm exit modal when user clicks on a link', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    await page.getByRole('link', { name: 'Basic HTML Quiz' }).click();

    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeVisible();
    await page
      .getByRole('button', { name: 'Yes, I want to leave the quiz' })
      .click();

    await page.waitForURL('/learn/full-stack-developer/#quiz-basic-html');
    await expect(
      page.getByRole('heading', { level: 3, name: 'Basic HTML Quiz' })
    ).toBeVisible();
  });

  test('should show a confirm exit modal when user closes the page', async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === 'webkit' || browserName === 'chromium',
      'This test is flaky on Chromium and WebKit'
    );

    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('beforeunload');
      await dialog.dismiss();
    });

    await page.close({ runBeforeUnload: true });
  });

  test('should allow user to complete the block when they pass the quiz', async ({
    page
  }) => {
    test.setTimeout(20000);

    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    const radioGroups = await page.getByRole('radiogroup').all();

    // Answer 17 questions correctly.
    // This is enough to pass the quiz, and also allowing us to test the quiz passing criteria.
    for (let i = 0; i < radioGroups.length; i++) {
      if (i <= 16) {
        await radioGroups[i].locator("[role='radio'][data-value='4']").click();
      } else {
        await radioGroups[i].locator("[role='radio'][data-value='1']").click();
      }
    }

    await page.getByRole('button', { name: 'Finish the quiz' }).click();
    await page.getByRole('button', { name: 'Yes, I am finished' }).click();

    // Wait for the finish quiz modal to close
    await expect(
      page.getByRole('dialog', { name: 'Finish Quiz' })
    ).toBeHidden();

    // Check that the completion modal shows up
    await expect(
      page
        .getByRole('dialog')
        .filter({ has: page.getByRole('button', { name: /submit and go/i }) })
    ).toBeVisible();

    await page
      .getByRole('dialog')
      .getByRole('button', { name: /close/i })
      .click();

    // Wait for the completion modal to close
    await expect(page.getByRole('dialog')).toBeHidden();

    // If the user closes the modal without submitting,
    // the finish quiz button is replaced by the submit one.
    await expect(
      page.getByRole('button', { name: 'Finish the quiz' })
    ).toBeHidden();
    await expect(
      page.getByRole('button', { name: /submit and go/i })
    ).toBeVisible();

    await expect(
      page.getByText('You have 17 out of 20 questions correct.')
    ).toBeVisible();

    // Find all of the disabled radio elements on the page,
    // and check if the count matches the total number of quiz answers (4 answers x 20 questions).
    // This approach is much faster than querying each radio on the page and check if they are disabled.
    await expect(
      page.locator("[role='radio'][aria-disabled='true']")
    ).toHaveCount(4 * 20);
  });
});
