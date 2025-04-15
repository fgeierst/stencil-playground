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
		width: 1px;
		height: 100%;
		cursor: ew-resize;
		position: relative;
		--width: calc(var(--padding) * 2);

		&:focus-visible {
			outline: none;
		}

		&::after {
			display: block;
			content: '';
			position: absolute;
			width: 1px;
			inset: 0;
			transform: translateX(-50%);
			background-color: var(--border-color);
			transition:
				background-color 0.2s ease,
				width 0.2s ease,
				height 0.2s ease;
		}

		&:before {
			/* extended grab area */
			position: absolute;
			content: '';
			inset: 0;
			width: var(--width);
			transform: translateX(-50%);
		}

		&:hover::after,
		&:focus-visible::after {
			background-color: var(--highlight-color);
			width: 2px;
		}

		&[data-orientation='vertical'] {
			cursor: ns-resize;
			width: 100%;
			height: 1px;

			&:before {
				position: absolute;
				content: '';
				inset: 0;
				height: var(--width);
				width: 100%;
				transform: translateY(-50%);
			}

			&::after {
				/* extended grab area */
				height: 1px;
				width: 100%;
				inset: 50% 0;
				transform: translateY(-50%);
			}

			&:hover::after,
			&:focus-visible::after {
				width: 100%;
				height: 2px;
			}
		}
	}
</style>
