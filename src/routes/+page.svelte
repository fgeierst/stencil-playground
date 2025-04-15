<script lang="ts">
	import { onMount } from 'svelte';
	import StatusBar from '../lib/components/Status.svelte';
	import Terminal from '../lib/components/Terminal.svelte';
	import Splitter from '$lib/components/Splitter.svelte';
	import Editor from '../lib/components/Editor.svelte';
	import { projectFiles } from '$lib/project-files';
	import { WebContainerService } from '$lib/webcontainer';
	import { terminalHistory } from '../lib/components/terminal-history.svelte';

	let wc: WebContainerService | null = null;
	let status = $state('');
	let code = $state(
		projectFiles.src.directory.components.directory['my-greeting'].directory['my-greeting.tsx'].file
			.contents
	);
	let iframeSrc = $state('about:blank');

	onMount(() => {
		if (!wc) {
			wc = new WebContainerService(
				projectFiles,
				handleStatusUpdate,
				handleReloadPreview,
				handleTerminalData
			);
			wc.initSequence();
		}
	});

	const handleStatusUpdate = (newStatus: string) => (status = newStatus);
	const handleReloadPreview = async (url: string = '') => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const nextUrl = new URL(url || iframeSrc);
		nextUrl.searchParams.set('t', Date.now().toString());
		iframeSrc = nextUrl.toString();
	};
	const handleTerminalData = (data: string) => (terminalHistory.data += data);
	const handleSave = () => wc?.updateFile('src/components/my-greeting/my-greeting.tsx', code);
	const handleEditEvent = (newCode: string) => (code = newCode);
</script>

<svelte:head>
	<title>StencilJS Playground</title>
</svelte:head>

<div id="controls">
	<h1>
		<img src="/favicon.svg" alt="" width="24" height="24" />
		StencilJS Playground
	</h1>
	<div id="actions">
		<button type="submit" id="save-button" onclick={handleSave}>Save</button>
		<button id="reload-button" onclick={() => handleReloadPreview()}>Reload</button>
	</div>
</div>
<Splitter>
	{#snippet first()}
		<Editor {code} editEvent={handleEditEvent}></Editor>
	{/snippet}
	{#snippet second()}
		<main>
			<Splitter orientation="vertical" defaultSize={[80, 20]}>
				{#snippet first()}
					<section aria-label="Preview" id="preview">
						<iframe id="preview-iframe" src={iframeSrc} title="Preview"></iframe>
					</section>
				{/snippet}
				{#snippet second()}
					<Terminal></Terminal>
				{/snippet}
			</Splitter>
		</main>
	{/snippet}
</Splitter>
<StatusBar {status}></StatusBar>

<style>
	#controls {
		padding: 10px;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		gap: 1rem;
		align-items: end;
		justify-content: space-between;
	}

	h1 {
		margin: 0;
		font-size: 1.2em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	h1 img {
		@media (prefers-color-scheme: dark) {
			filter: invert(1);
		}
	}

	#preview {
		height: 100%;
		padding: var(--padding);
	}

	#preview-iframe {
		flex-grow: 1;
		width: 100%;
		height: 100%;
		border-width: 0;
	}

	#actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
	}

	main {
		height: 100%;
	}
</style>
