<script module lang="ts">
	import { defineMeta, setTemplate, type Args } from '@storybook/addon-svelte-csf';
	import Splitter from './Splitter.svelte';

	const { Story } = defineMeta({
		component: Splitter,
		args: {
			defaultSize: [50, 50],
			orientation: 'horizontal'
		}
	});
</script>

<script>
	setTemplate(template);
</script>

<Story name="Horizontal" />

<Story
	name="Vertical"
	args={{
		orientation: 'vertical'
	}}
/>

{#snippet template(args: Args<typeof Story>)}
	<Splitter {...args}>
		{#snippet first()}
			<div>First pane</div>
		{/snippet}
		{#snippet second()}
			<div>Second pane</div>
		{/snippet}
	</Splitter>
{/snippet}

<style>
	:global(body),
	:global(html),
	:global(#storybook-root) {
		height: 100%;
	}
</style>
