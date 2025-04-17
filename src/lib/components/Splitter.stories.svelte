<script module lang="ts">
	import { defineMeta, setTemplate, type Args } from '@storybook/addon-svelte-csf';
	import Splitter from './Splitter.svelte';

	const { Story } = defineMeta({
		component: Splitter,
		args: {
			defaultSize: [50, 50],
			orientation: 'horizontal',
			collapsibleName: 'Hello'
		},
		argTypes: {
			orientation: {
				control: {
					type: 'select',
					options: ['horizontal', 'vertical']
				}
			},
			collapsibleName: {
				control: {
					type: 'text'
				}
			}
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

<Story
	name="Collapsible"
	args={{
		orientation: 'vertical',
		collapsibleName: 'My panel'
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
