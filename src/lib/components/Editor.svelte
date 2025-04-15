<script lang="ts">
	import { EditorView, basicSetup } from 'codemirror';
	import { Compartment } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { basicDark } from '@fsegurai/codemirror-theme-basic-dark';
	import { onMount } from 'svelte';

	let { code, editEvent } = $props();
	let editor: EditorView | null = null;
	const editorTheme = new Compartment();

	let isDarkMode = $state(true);

	function updateDarkModePreference(event: { matches: boolean }) {
		isDarkMode = event.matches;
		editor?.dispatch({
			effects: editorTheme.reconfigure(isDarkMode ? basicDark : [])
		});
	}

	onMount(() => {
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		isDarkMode = darkModeMediaQuery.matches;
		darkModeMediaQuery.addEventListener('change', updateDarkModePreference);

		editor = new EditorView({
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
						editEvent(editor?.state.doc.toString());
					}
				}),
				editorTheme.of(isDarkMode ? basicDark : [])
			],
			parent: document.querySelector('#editor')!
		});

		return () => {
			editor?.destroy();
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

	:global(.ͼ2 .cm-gutters) {
		border-right: 0;
	}

	:global(.ͼ1.cm-focused) {
		outline: none;
	}
</style>
