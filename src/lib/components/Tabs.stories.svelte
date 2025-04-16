<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tabs from './Tabs.svelte';

	const { Story } = defineMeta({
		component: Tabs,
		args: {}
	});
</script>

<Story name="Default" />
