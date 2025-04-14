import { WebContainer, type FileSystemTree } from '@webcontainer/api';

type WebContainerInstance = WebContainer | null;
type StatusListener = (status: string) => void;
type ReloadListener = (url?: string) => void;
type TerminalListener = (data: string) => void;

export class WebContainerService {
	#wc: WebContainerInstance = null;

	constructor(
		private readonly files: FileSystemTree,
		private readonly statusListener: StatusListener,
		private readonly reloadListener: ReloadListener,
		private readonly terminalListener: TerminalListener
	) {}

	public async initSequence(): Promise<void> {
		if (this.#wc) {
			this.statusListener('WebContainer already initialized');
			return;
		}
		try {
			// 1. Boot
			this.statusListener('Booting WebContainer...');
			this.#wc = await WebContainer.boot();

			// 2. Setup server-ready listener
			this.#wc.on('server-ready', async (port: number, url: string) => {
				this.statusListener(`Server ready on port ${port}.`);
				await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait, because the stencil dev server is up before the compiled files are written
				this.reloadListener(url);
			});

			// 3. Setup error listener
			this.#wc.on('error', ({ message }) => {
				this.statusListener(`WebContainer Error: ${message}`);
				console.error('WebContainer Error:', message);
			});

			// 4. Mount
			this.statusListener('Mounting project files...');
			await this.#wc.mount(this.files);

			// 5. Install dependencies
			this.statusListener('Installing dependencies...');
			const installExitCode = await this.exec('pnpm', ['install']);
			if (installExitCode !== 0) {
				throw new Error(`Install failed with exit code ${installExitCode}`);
			}

			// 6. Start dev server
			this.statusListener('Starting dev server...');
			const startExitCode = await this.exec('pnpm', ['start', '--', '--no-open']);
			if (startExitCode !== 0) {
				throw new Error(`Dev server failed with exit code ${startExitCode}`);
			}

			this.statusListener('Ready.');
		} catch (error) {
			this.statusListener(`Error initializing WebContainer: ${error}`);
		}
	}

	private async exec(command: string, args: string[]): Promise<number> {
		if (!this.#wc) {
			throw new Error('WebContainer not initialized');
		}
		const process = await this.#wc.spawn(command, args);

		process.output.pipeTo(
			new WritableStream({
				write: (data) => {
					this.terminalListener(data);
				}
			})
		);

		return process.exit;
	}

	public async updateFile(path: string, data: string): Promise<void> {
		if (!this.#wc) {
			throw new Error('WebContainer not initialized');
		}
		await this.#wc.fs.writeFile(path, data);
		this.statusListener(`Updated file: ${path}`);
		this.reloadListener();
	}
}
