import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: {
		baseURL: 'http://localhost:4173'
	},
	webServer: {
		reuseExistingServer: !process.env.CI,
		command: 'pnpm build && pnpm preview',
		port: 4173
	},
	testDir: 'tests'
});
