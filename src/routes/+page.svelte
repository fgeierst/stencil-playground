<script lang="ts">
	import { onMount } from 'svelte';
	import StatusBar from './Status.svelte';
	import Splitter from '$lib/components/Splitter.svelte';
	import { projectFiles } from '$lib/project-files';
	import { WebContainer } from '@webcontainer/api';
	import { getWebContainer } from '$lib/webcontainer';

	let wc: WebContainer | undefined;
	let status = $state('');
	let code = $state(
		projectFiles.src.directory.components.directory['my-greeting'].directory['my-greeting.tsx'].file
			.contents
	);
	let iframeSrc = $state('about:blank');

	const handleSave = async () => {
		if (wc) {
			await wc.fs.writeFile('src/components/my-greeting/my-greeting.tsx', code);
			reloadIframe();
			status = 'Component file updated in container.';
		}
	};

	const reloadIframe = async () => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const url = new URL(iframeSrc);
		url.searchParams.set('t', Date.now().toString());
		iframeSrc = url.toString();
	};

	onMount(() => {
		const terminalEl = document.getElementById('terminal')!;

		async function main() {
			status = 'Loading WebContainer...';

			try {
				status = 'Booting WebContainer...';
				wc = await getWebContainer();
				status = 'WebContainer Booted.';

				status = 'Mounting project files...';
				await wc.mount(projectFiles);
				status = 'Files Mounted.';

				// Listener for server readiness
				wc.on('server-ready', async (port, url) => {
					status = `Server ready on port ${port}. Preview loaded.`;
					await new Promise((resolve) => setTimeout(resolve, 3000)); // The stencil dev server is up before the compiled files are written
					iframeSrc = url;
				});

				// Listener for container errors
				wc.on('error', ({ message }) => {
					status = `WebContainer Error: ${message}`;
					console.error('WebContainer Error:', message);
				});

				//Run pnpm install
				status = 'Running pnpm install... (this may take a moment)';
				const installProcess = await wc.spawn('pnpm', ['install']);

				installProcess.output.pipeTo(
					new WritableStream({
						write(data) {
							logTerminal(data);
						}
					})
				);

				// Wait for install process to exit
				const installExitCode = await installProcess.exit;
				if (installExitCode !== 0) {
					throw new Error(`pnpm install failed with exit code ${installExitCode}`);
				}
				status = 'pnpm install complete.';

				// List installed packages
				logTerminal('\n\n$ ls ./node_modules/.pnpm/\n');
				const ls = await wc.spawn('ls', ['./node_modules/.pnpm/']);
				ls.output.pipeTo(
					new WritableStream({
						write(data) {
							logTerminal(data);
						}
					})
				);
				await ls.exit;

				// Run pnpm start
				status = 'Starting dev server (pnpm start)...';
				logTerminal('\n\n$ pnpm start^\n');
				const startProcess = await wc.spawn('pnpm', ['start', '--', '--no-open']);

				startProcess.output.pipeTo(
					new WritableStream({
						write(data) {
							logTerminal(data);
						}
					})
				);

				await startProcess.exit;

				// List www
				logTerminal('\n\n$ ls ./www/\n');
				const ls2 = await wc.spawn('ls', ['./www/']);
				ls2.output.pipeTo(
					new WritableStream({
						write(data) {
							logTerminal(data);
						}
					})
				);
				await ls2.exit;
			} catch (error: unknown) {
				console.error('Initialization Error:', error);
				if (error instanceof Error) {
					status = `Error initializing playground: ${error.message}`;
				} else {
					status = `Error initializing playground.`;
				}
				if (wc) {
					// Optional: Attempt to tear down the instance on error
				}
			}
		}

		main();

		function logTerminal(data: string) {
			terminalEl.textContent += data;
			// Auto-scroll to the bottom
			terminalEl.scrollTop = terminalEl.scrollHeight;
		}
	});
</script>

<svelte:head>
	<title>StencilJS Playground</title>
</svelte:head>

<div id="controls">
	<h1>StencilJS Playground</h1>
	<div class="status">
		<StatusBar {status}></StatusBar>
		<button id="reload-button" onclick={reloadIframe}>Reload</button>
	</div>
</div>
<Splitter orientation="vertical" defaultSize={[80, 20]}>
	{#snippet first()}
		<main>
			<Splitter>
				{#snippet first()}
					<div id="editor">
						<textarea id="code-editor" bind:value={code}></textarea>
						<button type="submit" id="save-button" onclick={handleSave}>Save</button>
					</div>
				{/snippet}
				{#snippet second()}
					<iframe id="preview-iframe" src={iframeSrc} title="Preview"></iframe>
				{/snippet}
			</Splitter>
		</main>
	{/snippet}
	{#snippet second()}
		<pre id="terminal">Starting WebContainer logs...</pre>
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
	}

	textarea {
		flex-grow: 1;
		padding: 1rem;
		border-width: 0;
	}
</style>
