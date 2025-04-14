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

	const terminalEl = page.locator('#terminal');
	await expect(terminalEl).toContainText('build finished, watching for changes...');

	const codeEditor = page.locator('#code-editor');
	await expect(codeEditor).toBeVisible();

	const mountedWebComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hello, WebContainer!' });
	await expect(mountedWebComponent).toBeVisible();
});
