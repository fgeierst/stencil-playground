<script lang="ts">
	import { FancyAnsi } from 'fancy-ansi';

	const { terminalData } = $props();

	let preEl = $state<HTMLPreElement | null>(null);
	const fancyAnsi = new FancyAnsi();

	$effect(() => {
		if (preEl && terminalData) preEl.scrollTop = preEl.scrollHeight;
	});
</script>

<section aria-label="Terminal">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<pre bind:this={preEl}>{@html fancyAnsi.toHtml(terminalData)}</pre>
</section>

<style>
	section {
		height: 100%;
		display: grid;
	}
	pre {
		overflow-y: scroll;
		background-color: #222;
		color: #eee;
		font-family: monospace;
		font-size: 0.8em;
		padding: 5px;
		white-space: pre-wrap;
		margin: 0;
	}
</style>
