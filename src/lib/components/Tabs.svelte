<script lang="ts">
	import * as tabs from '@zag-js/tabs';
	import { useMachine } from '@zag-js/svelte';

	const data = [
		{ value: 'item-1', label: 'Item one', content: 'Item one content' },
		{ value: 'item-2', label: 'Item two', content: 'Item two content' },
		{ value: 'item-3', label: 'Item three', content: 'Item three content' }
	];

	const id = $props.id();
	const service = useMachine(tabs.machine, {
		id,
		defaultValue: 'item-1'
	});

	const api = $derived(tabs.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()}>
	<div {...api.getListProps()}>
		{#each data as item}
			<button {...api.getTriggerProps({ value: item.value })}>
				{item.label}
			</button>
		{/each}
	</div>
	{#each data as item}
		<div {...api.getContentProps({ value: item.value })}>
			<p>{item.content}</p>
		</div>
	{/each}
</div>
