<script lang="ts">
	import { FancyAnsi } from 'fancy-ansi';
	import { terminalHistory } from './terminal-history.svelte';

	let preEl = $state<HTMLPreElement | null>(null);

	const fancyAnsi = new FancyAnsi();

	$effect(() => {
		if (preEl && terminalHistory.data) preEl.scrollTop = preEl.scrollHeight;
	});
</script>

<section aria-label="Terminal">
	<pre bind:this={preEl}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html fancyAnsi.toHtml(terminalHistory.data)}
	</pre>
</section>

<style>
	section {
		height: 100%;
		display: grid;
	}
	pre {
		--ansi-dim-opacity: 1;

		--ansi-black: light-dark(#333333, #1e1e1e);
		--ansi-red: light-dark(#b04020, #ce9178);
		--ansi-green: light-dark(#6a7931, #dcdcaa);
		--ansi-yellow: light-dark(#6a7931, #dcdcaa);
		--ansi-blue: light-dark(#005aab, #569cd6);
		--ansi-magenta: light-dark(#8f3c8c, #c586c0);
		--ansi-cyan: light-dark(#1e776a, #4ec9b0);
		--ansi-white: light-dark(#555555, #d4d4d4);
		--ansi-bright-black: light-dark(#666666, #ababab);
		--ansi-bright-red: light-dark(#b04020, #e0a080);
		--ansi-bright-green: light-dark(#6a7931, #ecefcc);
		--ansi-bright-yellow: light-dark(#6a7931, #ecefcc);
		--ansi-bright-blue: light-dark(#005aab, #9cdcfe);
		--ansi-bright-magenta: light-dark(#8f3c8c, #e0a0e0);
		--ansi-bright-cyan: light-dark(#1e776a, #79e8d2);
		--ansi-bright-white: light-dark(#555555, #ffffff);

		overflow-y: scroll;
		font-family: monospace;
		padding: var(--padding);
		white-space: pre-wrap;
		margin: 0;
	}
</style>
