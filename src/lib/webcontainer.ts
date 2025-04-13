import { WebContainer } from '@webcontainer/api';

let webContainerInstance: WebContainer | null = null;

export async function getWebContainer(): Promise<WebContainer> {
	if (!webContainerInstance) {
		webContainerInstance = await WebContainer.boot();
	}
	return webContainerInstance;
}
