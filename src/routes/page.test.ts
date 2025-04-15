import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/StencilJS Playground/);
});

test('mounts webcontainer', async ({ page }) => {
	const terminal = page.getByRole('region', { name: 'Terminal' });
	const ready = terminal.getByText('Server ready on port');

	await expect(ready).toBeVisible({ timeout: 25 * 1000 }); // time to boot webcontainer
	await expect(terminal).toContainText('build finished, watching for changes...');

	const previewComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hello, World!' });
	await expect(previewComponent).toBeVisible();
});

test('make a code change and update the preview', async ({ page }) => {
	const ready = page.getByRole('region', { name: 'Terminal' }).getByText('Server ready');
	await expect(ready).toBeVisible({ timeout: 25 * 1000 });

	const editor = page.getByRole('region', { name: 'Editor' });
	const textbox = editor.getByRole('textbox');
	await textbox.fill('');
	await textbox.fill(`import { Component, h } from '@stencil/core';
@Component({ tag: 'my-greeting', shadow: true })
export class MyGreeting {
  render() { return (<div>Hola!</div>); }
}`);

	const saveButton = page.getByRole('button', { name: 'Save' });
	await saveButton.click();

	const previewComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hola!' });
	await expect(previewComponent).toBeVisible();
});
