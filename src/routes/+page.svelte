<script lang="ts">
	import Editor from '../lib/components/Editor.svelte';

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
						<div class="status">
							<StatusBar {status}></StatusBar>
						</div>
					</section>
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
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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

	#preview {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	#preview-iframe {
		flex-grow: 1;
		width: 100%;
		height: 100%;
		border-width: 0;
	}

	.status {
		flex-shrink: 1;
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
