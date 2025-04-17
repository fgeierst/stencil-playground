<script lang="ts">
	import { onMount } from 'svelte';
	import StatusBar from '../lib/components/Status.svelte';
	import Terminal from '../lib/components/Terminal.svelte';
	import Splitter from '$lib/components/Splitter.svelte';
	import Editor from '../lib/components/Editor.svelte';
	import Preview from '../lib/components/Preview.svelte';
	import { projectFiles } from '$lib/project-files';
	import { WebContainerService } from '$lib/webcontainer';
	import { terminalHistory } from '../lib/components/terminal-history.svelte';

	let wc: WebContainerService | null = null;
	let status = $state('');
	let code = $state(
		projectFiles.src.directory.components.directory['my-greeting'].directory['my-greeting.tsx'].file
			.contents
	);
	let editedCode = $state('');
	let compiledJs = $state('');
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

		document.addEventListener('keyup', handleKeyup);

		return () => {
			document.removeEventListener('keyup', handleKeyup);
			wc?.teardown();
		};
	});

	const handleKeyup = (e: KeyboardEvent) => {
		if (e.key === 'r' && e.ctrlKey) {
			e.preventDefault();
			handleReloadPreview();
		}
		if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			handleDownloadLockfile();
		}
	};

	const handleSave = async () => {
		await wc?.updateFile('src/components/my-greeting/my-greeting.tsx', editedCode);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		handleReloadPreview();
	};

	const handleReloadPreview = async (url: string = '') => {
		console.log('handleReloadPreview, url:', url);
		const nextUrl = new URL(url || iframeSrc);
		nextUrl.searchParams.set('t', Date.now().toString());
		iframeSrc = nextUrl.toString();
		const newCompiledJs = (await wc?.readFile(
			'./www/build/my-greeting.entry.js',
			'utf-8'
		)) as string;
		compiledJs = newCompiledJs;
	};

	const handleEditEvent = (newCode: string) => (editedCode = newCode);
	const handleStatusUpdate = (newStatus: string) => (status = newStatus);
	const handleTerminalData = (data: string) => (terminalHistory.data += data);
	const handleDownloadLockfile = async () => {
		const file = (await wc?.readFile('./pnpm-lock.yaml')) as Uint8Array;
		const blob = new Blob([file], { type: 'text/yaml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'pnpm-lock.yaml';
		a.click();
		URL.revokeObjectURL(url);
	};
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
		<button onclick={handleSave}>Save</button>
	</div>
</div>
<Splitter>
	{#snippet first()}
		<Editor {code} editEvent={handleEditEvent}></Editor>
	{/snippet}
	{#snippet second()}
		<main>
			<Splitter orientation="vertical" defaultSize={[80, 20]} collapsibleName="Terminal">
				{#snippet first()}
					<Preview {iframeSrc} {compiledJs}></Preview>
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

	#actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
	}

	main {
		height: 100%;
		width: 100%;
	}
</style>
