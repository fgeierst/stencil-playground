<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Terminal from './Terminal.svelte';

	const terminalData = `Progress: resolved [96m1[39m, reused [96m0[39m, downloaded [96m0[39m, added [96m0[39m
[1APackages: [32m+1[39m[0K
[32m+[39m
Progress: resolved [96m1[39m, reused [96m0[39m, downloaded [96m0[39m, added [96m0[39m
[1AProgress: resolved [96m1[39m, reused [96m0[39m, downloaded [96m1[39m, added [96m0[39m
[1AProgress: resolved [96m1[39m, reused [96m0[39m, downloaded [96m1[39m, added [96m1[39m, done

[96mdependencies:[39m
[32m+[39m @stencil/core [90m4.25.0[39m [90m(4.29.3 is available)[39m

Done in 5.6s

> stencil-minimal-webcontainer@0.0.1 start /home/2iz2mipdepnhp6qpfzvdk555x0tkc6-1v5n
> stencil build --dev --watch --serve "--" "--no-open"

[2m[17:55.7][22m  [36m@stencil/core[39m
[2m[17:56.3][22m  [36mv4.25.0[39m 🏅
[2m[17:57.1][22m  build, myplayground, dev mode, started [2m...[22m
[2m[17:57.1][22m  transpile started [2m...[22m
[2m[17:57.2][22m  transpile finished [2min 93 ms[22m
[2m[17:58.5][22m  build, myplayground, dev mode, started [2m...[22m
[2m[17:58.5][22m  transpile started [2m...[22m
[2m[17:58.5][22m  transpile finished [2min 20 ms[22m
[2m[17:58.5][22m  generate lazy + source maps started [2m...[22m
[2m[17:58.7][22m  generate lazy + source maps finished [2min 214 ms[22m
[2m[17:58.7][22m  copy started [2m...[22m
[2m[17:58.7][22m  copy finished (0 files) [2min 3 ms[22m
[2m[17:58.7][22m  [1m[32mbuild finished, watching for changes...[39m[22m
           [2min 249 ms[22m

[2m[17:58.7][22m  [36mhttp://localhost:3333/[39m`;

	const { Story } = defineMeta({
		component: Terminal,
		args: { terminalData }
	});
</script>

<Story name="Default" />
