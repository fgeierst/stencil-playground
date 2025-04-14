import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/StencilJS Playground/);
});

test('mounts webcontainer', async ({ page }) => {
	await page.goto('/');

	const serverReadyMsg = page.getByText('Server ready on port');
	await expect(serverReadyMsg).toBeVisible({
		timeout: 25 * 1000
	});

	const terminal = page.getByRole('region', { name: 'Terminal' });
	await expect(terminal).toContainText('build finished, watching for changes...');

	const editor = page.getByRole('region', { name: 'Editor' });
	await expect(editor).toBeVisible();

	const mountedWebComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hello, WebContainer!' });
	await expect(mountedWebComponent).toBeVisible();
});
