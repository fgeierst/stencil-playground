<script lang="ts">
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import * as splitter from '@zag-js/splitter';
	import type { Snippet } from 'svelte';

	type Props = {
		first: Snippet;
		second: Snippet;
		orientation?: 'horizontal' | 'vertical';
		defaultSize?: [number, number];
	};
	let { first, second, orientation = 'horizontal', defaultSize = [50, 50] }: Props = $props();

	const id = $props.id();
	const service = useMachine(splitter.machine, {
		id,
		defaultSize,
		orientation,
		panels: [
			{ id: 'a', minSize: 0 },
			{ id: 'b', minSize: 0 }
		]
	});
	const api = $derived(splitter.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()}>
	<div {...api.getPanelProps({ id: 'a' })}>
		{@render first()}
	</div>
	<div {...api.getResizeTriggerProps({ id: 'a:b' })} class="trigger"></div>
	<div {...api.getPanelProps({ id: 'b' })}>
		{@render second()}
	</div>
</div>

<style>
	.trigger {
		width: 10px;
		/* background-color: rgba(0, 0, 0, 0.01); */
		cursor: ew-resize;
		position: relative;
		--width: 4px;
		--height: 40px;

		&:before {
			display: block;
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: var(--width);
			height: var(--height);
			border-radius: 2px;
			background-color: #666;
		}

		&[data-orientation='vertical'] {
			cursor: ns-resize;
			width: 100%;
			height: 10px;
		}

		&[data-orientation='vertical']::before {
			width: var(--height);
			height: var(--width);
		}
	}
</style>
