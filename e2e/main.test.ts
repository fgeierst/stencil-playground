import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	await expect(page).toHaveTitle(/StencilJS Playground/);
});

test('mounts webcontainer', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	const serverReadyMsg = page.getByText('Status: Server ready on port');
	await expect(serverReadyMsg).toBeVisible({
		timeout: 20 * 1000
	});

	const terminalEl = page.locator('#terminal');
	await expect(terminalEl).toContainText('Starting WebContainer logs...');

	const codeEditor = page.locator('#code-editor');
	await expect(codeEditor).toBeVisible();

	const mountedWebComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hello, WebContainer User!' });
	await expect(mountedWebComponent).toBeVisible();
});
