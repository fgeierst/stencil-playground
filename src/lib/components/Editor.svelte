<script lang="ts">
	import { EditorView, basicSetup } from 'codemirror';
	import { Compartment, EditorState } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { basicDark } from '@fsegurai/codemirror-theme-basic-dark';
	import { onMount } from 'svelte';

	type Props = {
		code: string;
		editEvent: (newCode: string) => void;
		readonly?: boolean;
	};
	let { code, editEvent, readonly = false }: Props = $props();
	const id = $props.id();

	let editor: EditorView | null = null;
	const editorTheme = new Compartment();

	$effect(() => {
		editor?.dispatch({
			changes: { from: 0, to: editor.state.doc.length, insert: code }
		});
	});

	function updateDarkModePreference(event: { matches: boolean }) {
		editor?.dispatch({
			effects: editorTheme.reconfigure(event.matches ? basicDark : [])
		});
	}

	onMount(() => {
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
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
						const newCode = editor?.state.doc.toString();
						if (newCode) editEvent(newCode);
					}
				}),
				editorTheme.of(darkModeMediaQuery.matches ? basicDark : []),
				EditorState.readOnly.of(readonly)
			],
			parent: document.querySelector(`#editor-${id}`)!
		});

		return () => {
			editor?.destroy();
			darkModeMediaQuery.removeEventListener('change', updateDarkModePreference);
		};
	});
</script>

<section aria-label="Editor">
	<div id={`editor-${id}`}></div>
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
