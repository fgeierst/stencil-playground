import { describe, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Terminal from './Terminal.svelte';

describe('Terminal', () => {
	it('should render as region with accessible name', ({ expect }) => {
		render(Terminal);
		const region = screen.getByRole('region', { name: /Terminal/i });
		expect(region).toBeInTheDocument();
	});

	it('should convert ansi to html', ({ expect }) => {
		vi.mock('../../stores/terminal-history.svelte', () => ({
			terminalHistory: { data: '\x1b[31mHello\x1b[0m' }
		}));
		render(Terminal);
		const output = screen.getByText('Hello');
		expect(output).toHaveStyle({ color: 'var(--ansi-red, #cc0000)' });
	});
});
