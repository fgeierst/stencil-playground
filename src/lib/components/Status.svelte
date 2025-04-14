<script lang="ts">
	type Props = {
		status?: string;
	};
	let { status }: Props = $props();
</script>

<div id="status" aria-live="polite">{status}</div>

<style>
	div {
		border-block-start: 1px solid rgba(0, 0, 0, 0.1);
		padding-block: 0.2rem;
		height: calc(1.1lh);
	}
</style>
