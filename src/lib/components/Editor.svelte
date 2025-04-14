<script lang="ts">
	let { code } = $props();
</script>

<section aria-label="Editor">
	<textarea id="code-editor" bind:value={code}></textarea>
</section>

<style>
	section {
		height: 100%;
		display: grid;
	}

	textarea {
		padding: 1rem;
		border-width: 0;
	}
</style>
