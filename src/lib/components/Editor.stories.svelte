<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	import Editor from './Editor.svelte';
	import { projectFiles } from '$lib/project-files';

	const { Story } = defineMeta({
		component: Editor,
		args: {
			editEvent: fn(),
			code: projectFiles.src.directory.components.directory['my-greeting'].directory[
				'my-greeting.tsx'
			].file.contents
		}
	});
</script>

<Story name="JSX" />

<Story
	name="CSS"
	args={{
		code: projectFiles.src.directory.components.directory['my-greeting'].directory[
			'my-greeting.css'
		].file.contents
	}}
/>

<Story
	name="readonly"
	args={{
		readonly: true
	}}
/>
