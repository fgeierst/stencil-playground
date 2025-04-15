import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/StencilJS Playground/);
});

test('mounts webcontainer', async ({ page }) => {
	await page.goto('/');

	const terminal = page.getByRole('region', { name: 'Terminal' });
	const serverReadyMsg = terminal.getByText('Server ready on port');
	await expect(serverReadyMsg).toBeVisible({
		timeout: 25 * 1000 // time to mount webcomponent
	});

	await expect(terminal).toContainText('build finished, watching for changes...');

	const editor = page.getByRole('region', { name: 'Editor' });
	await expect(editor).toBeVisible();

	const mountedWebComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hello, World!' });
	await expect(mountedWebComponent).toBeVisible();
});

test('make a code change and update the preview', async ({ page }) => {
	await page.goto('/');

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
	const mountedWebComponent = page
		.locator('iframe[title="Preview"]')
		.contentFrame()
		.locator('my-greeting')
		.filter({ hasText: 'Hola!' });
	await expect(mountedWebComponent).toBeVisible();
});
