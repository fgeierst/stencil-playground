<script lang="ts">
	type Props = {
		status?: string;
	};
	let { status }: Props = $props();
</script>

<div id="status" aria-live="polite" class="visually-hidden">{status}</div>

<style>
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
