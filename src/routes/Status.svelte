<script lang="ts">
	type Props = {
		status?: string;
	};
	let { status }: Props = $props();
</script>

<div id="status">{status}</div>

<style>
</style>
