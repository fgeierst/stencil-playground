<script lang="ts">
	import { FancyAnsi } from 'fancy-ansi';
	import { terminalHistory } from '../../stores/terminal-history.svelte';

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
		overflow-y: scroll;
		background-color: white;
		font-family: monospace;
		padding: 1em;
		white-space: pre-wrap;
		margin: 0;
	}
</style>
