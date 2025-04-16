<script lang="ts">
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import * as tabs from '@zag-js/tabs';
	import { onMount } from 'svelte';
	import Editor from './Editor.svelte';

	const { iframeSrc, compiledJs } = $props();

	const id = $props.id();
	const service = useMachine(tabs.machine, {
		id,
		defaultValue: 'result'
	});

	const api = $derived(tabs.connect(service, normalizeProps));
	onMount(() => {});
</script>

<section aria-label="Preview">
	<div {...api.getRootProps()}>
		<div {...api.getListProps()} class="triggers">
			<button {...api.getTriggerProps({ value: 'result' })}>Result</button>
			<button {...api.getTriggerProps({ value: 'js' })}>Javascript</button>
		</div>
		<div {...api.getContentProps({ value: 'result' })}>
			<iframe src={iframeSrc} title="Preview"></iframe>
		</div>
		<div {...api.getContentProps({ value: 'js' })}>
			<Editor code={compiledJs} editEvent={(e) => console.log(e)} readonly={true}></Editor>
		</div>
	</div>
</section>

<style>
	section {
		height: 100%;
		padding: var(--padding);
	}

	.triggers {
		margin-block-end: calc(var(--padding) * 2);
	}

	iframe {
		flex-grow: 1;
		width: 100%;
		height: 100%;
		border-width: 0;
	}

	button {
		background: transparent;
		border: none;
		padding: var(--padding) 0;
		cursor: pointer;
		font-size: inherit;
		color: var(--text-color);
		margin-inline-end: var(--padding);

		&[aria-selected='true'] {
			border: solid var(--text-color);
			border-width: 0 0 2px 0;
		}
	}
</style>
