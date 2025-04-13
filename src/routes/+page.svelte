<script lang="ts">
	import { WebContainer } from '@webcontainer/api';
	import { projectFiles } from '$lib/project-files';
	import { onMount } from 'svelte';

	onMount(() => {
		const iframeEl = document.getElementById('preview-iframe')! as HTMLIFrameElement;
		const terminalEl = document.getElementById('terminal')!;
		const status1El = document.querySelector('#status1')!;
		const status2El = document.querySelector('#status2')!;
		const reloadButton = document.getElementById('reload-button')!;
		const saveButton = document.getElementById('save-button')!;
		let webcontainerInstance: WebContainer | null = null;

		reloadButton.addEventListener('click', () => {
			iframeEl.src = iframeEl.src;
		});

		saveButton.addEventListener('click', async () => {
			const codeEditor = document.getElementById('code-editor') as HTMLTextAreaElement;
			if (codeEditor && webcontainerInstance) {
				const updatedContent = codeEditor.value;
				await webcontainerInstance.fs.writeFile(
					'src/components/my-greeting/my-greeting.tsx',
					updatedContent
				);
				logStatus('Component file updated in container.');
			}
		});

		document.addEventListener('DOMContentLoaded', () => {
			const codeEditor = document.getElementById('code-editor') as HTMLTextAreaElement;
			if (codeEditor) {
				const myGreetingContent =
					projectFiles.src.directory.components.directory['my-greeting'].directory[
						'my-greeting.tsx'
					].file.contents;
				codeEditor.value = myGreetingContent;
			}
		});

		async function main() {
			logStatus('Loading WebContainer...');

			try {
				logStatus('Booting WebContainer...');
				webcontainerInstance = await WebContainer.boot();
				logStatus('WebContainer Booted.');

				logStatus('Mounting project files...');
				await webcontainerInstance.mount(projectFiles);
				logStatus('Files Mounted.');

				// Listener for server readiness
				webcontainerInstance.on('server-ready', async (port, url) => {
					logStatus(`Server ready on port ${port}`, `Preview loaded.`);
					await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for a moment
					iframeEl.src = url; // Update iframe source
				});

				// Listener for container errors
				webcontainerInstance.on('error', ({ message }) => {
					logStatus('WebContainer Error:', message);
					console.error('WebContainer Error:', message);
				});

				//Run pnpm install
				logStatus('Running pnpm install...', '(this may take a moment)');
				const installProcess = await webcontainerInstance.spawn('pnpm', ['install']);

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
				logStatus('pnpm install complete.');

				// List installed packages
				logTerminal('\n\n$ ls ./node_modules/.pnpm/\n');
				const ls = await webcontainerInstance.spawn('ls', ['./node_modules/.pnpm/']);
				ls.output.pipeTo(
					new WritableStream({
						write(data) {
							logTerminal(data);
						}
					})
				);
				await ls.exit;

				// Run pnpm start
				logStatus('Starting dev server (pnpm start)...');
				logTerminal('\n\n$ pnpm start^\n');
				const startProcess = await webcontainerInstance.spawn('pnpm', ['start', '--', '--no-open']);

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
				const ls2 = await webcontainerInstance.spawn('ls', ['./www/']);
				ls2.output.pipeTo(
					new WritableStream({
						write(data) {
							logTerminal(data);
						}
					})
				);
				await ls2.exit;
			} catch (error: unknown) {
				if (error instanceof Error) {
					logStatus('Error initializing playground:', error.message);
					console.error('Initialization Error:', error);
				} else {
					logStatus('Error initializing playground:', 'Unknown error');
					console.error('Initialization Error:', error);
				}
				if (webcontainerInstance) {
					// Optional: Attempt to tear down the instance on error
				}
			}
		}

		main();

		function logStatus(msg1: string, msg2 = '') {
			// console.log(msg1, msg2);
			status1El.textContent = `Status: ${msg1}`;
			status2El.textContent = msg2;
		}

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
		<div>
			<div id="status1">Status: Initializing...</div>
			<div id="status2">&nbsp;</div>
		</div>
		<button id="reload-button">Reload</button>
	</div>
</div>
<main>
	<div id="editor">
		<textarea id="code-editor"></textarea>
		<button type="submit" id="save-button">Save</button>
	</div>
	<iframe id="preview-iframe" src="about:blank" title="Preview"></iframe>
</main>
<pre id="terminal">Starting WebContainer logs...</pre>

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
		height: 250px;
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
		flex-grow: 1;
		display: grid;
		grid-auto-flow: row;
		gap: 10px;

		@media (min-width: 500px) {
			grid-template-columns: 1fr 1fr;
		}
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
