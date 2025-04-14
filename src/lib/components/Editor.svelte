<script lang="ts">
	import { EditorView, basicSetup } from 'codemirror';
	import { javascript } from '@codemirror/lang-javascript';
	import { onMount } from 'svelte';

	let { code, editEvent } = $props();

	onMount(() => {
		const editor = new EditorView({
			doc: code,
			extensions: [
				basicSetup,
				javascript({
					jsx: true,
					typescript: true
				}),
				EditorView.lineWrapping,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						editEvent(editor.state.doc.toString());
					}
				})
			],
			parent: document.querySelector('#editor')!
		});

		return () => {
			editor.destroy();
		};
	});
</script>

<section aria-label="Editor">
	<div id="editor"></div>
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
