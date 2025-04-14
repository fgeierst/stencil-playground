<script lang="ts">
	import { onMount } from 'svelte';
	import StatusBar from '../lib/components/Status.svelte';
	import Terminal from '../lib/components/Terminal.svelte';
	import Splitter from '$lib/components/Splitter.svelte';
	import { projectFiles } from '$lib/project-files';
	import { WebContainerService } from '$lib/webcontainer';

	let wc: WebContainerService | null = null;
	let status = $state('');
	let terminalData = $state('');
	let code = $state(
		projectFiles.src.directory.components.directory['my-greeting'].directory['my-greeting.tsx'].file
			.contents
	);
	let iframeSrc = $state('about:blank');

	onMount(() => {
		wc = new WebContainerService(
			projectFiles,
			handleStatusUpdate,
			handleReloadPreview,
			handleTerminalData
		);
		wc.initSequence();
	});

	const handleStatusUpdate = (newStatus: string) => (status = newStatus);
	const handleReloadPreview = async (url: string = '') => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const nextUrl = new URL(url || iframeSrc);
		nextUrl.searchParams.set('t', Date.now().toString());
		iframeSrc = nextUrl.toString();
	};
	const handleTerminalData = (data: string) => (terminalData += data);
	const handleSave = () => wc?.updateFile('src/components/my-greeting/my-greeting.tsx', code);
</script>

<svelte:head>
	<title>StencilJS Playground</title>
</svelte:head>

<div id="controls">
	<h1>StencilJS Playground</h1>
	<div class="status">
		<StatusBar {status}></StatusBar>
		<button id="reload-button" onclick={() => handleReloadPreview()}>Reload</button>
	</div>
</div>
<Splitter>
	{#snippet first()}
		<div id="editor">
			<textarea id="code-editor" bind:value={code}></textarea>
			<button type="submit" id="save-button" onclick={handleSave}>Save</button>
		</div>
	{/snippet}
	{#snippet second()}
		<main>
			<Splitter orientation="vertical" defaultSize={[80, 20]}>
				{#snippet first()}
					<iframe id="preview-iframe" src={iframeSrc} title="Preview"></iframe>
				{/snippet}
				{#snippet second()}
					<Terminal {terminalData}></Terminal>
				{/snippet}
			</Splitter>
		</main>
	{/snippet}
</Splitter>

<style>
	#controls {
		padding: 10px;
		background-color: #f0f0f0;
		border-bottom: 1px solid #ccc;
		flex-shrink: 0;
	}

	#preview-iframe {
		flex: 1;
		flex-grow: 1;
		width: 100%;
		height: 100%;
		border-width: 0;
	}
	#terminal {
		flex-shrink: 0;
		height: 100%;
		overflow-y: scroll;
		background-color: #222;
		color: #eee;
		font-family: monospace;
		font-size: 0.8em;
		padding: 5px;
		white-space: pre-wrap;
		border-top: 1px solid #ccc;
		margin: 0;
	}
	h1 {
		margin: 0 0 10px 0;
		font-size: 1.2em;
	}

	.status {
		display: flex;
		gap: 0.5rem;
		align-items: end;
		justify-content: space-between;
	}

	main {
		height: 100%;
	}

	#editor {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
	}

	textarea {
		flex-grow: 1;
		padding: 1rem;
		border-width: 0;
	}
</style>
