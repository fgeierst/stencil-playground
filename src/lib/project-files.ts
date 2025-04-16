import type { FileSystemTree } from '@webcontainer/api';
export const projectFiles: FileSystemTree = {
	'package.json': {
		file: {
			contents: JSON.stringify(
				{
					name: 'stencil-minimal-webcontainer',
					version: '0.0.1',
					private: true,
					type: 'module',
					dependencies: {
						'@stencil/core': '4.25.0'
					},
					scripts: {
						build: 'stencil build',
						start: 'stencil build --dev --watch --serve',
						test: 'echo "No tests configured" && exit 0'
					}
				},
				null,
				2
			)
		}
	},
	'pnpm-lock.yaml': {
		file: {
			contents: `lockfileVersion: '6.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

dependencies:
  '@stencil/core':
    specifier: 4.25.0
    version: 4.25.0

packages:

  /@stencil/core@4.25.0:
    resolution: {integrity: sha512-mLyaGCCGaHh6M4n1Hs3CXytD8MLQEt/eBBEoeJvAKE82S3CaqT5n5STXNHnv+qRz3btaSzqEfn2DBTurHYgKeQ==}
    engines: {node: '>=16.0.0', npm: '>=7.10.0'}
    hasBin: true
    dev: false
`
		}
	},

	'stencil.config.ts': {
		file: {
			contents: `import { Config } from '@stencil/core';
export const config: Config = {
  namespace: 'myplayground',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'www', serviceWorker: null, },
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    openBrowser: false,
    root: 'www',
    basePath: '/',
  },
};`
		}
	},
	'tsconfig.json': {
		file: {
			contents: JSON.stringify(
				{
					compilerOptions: {
						allowSyntheticDefaultImports: true,
						experimentalDecorators: true,
						lib: ['dom', 'es2017'],
						moduleResolution: 'node',
						module: 'esnext',
						target: 'es2017',
						jsx: 'react',
						jsxFactory: 'h',
						allowJs: true,
						skipLibCheck: true,
						forceConsistentCasingInFileNames: true
					},
					include: ['src'],
					exclude: ['node_modules']
				},
				null,
				2
			)
		}
	},
	src: {
		directory: {
			'index.html': {
				file: {
					contents: `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Stencil Dev Server</title>
		<script type="module" src="/build/myplayground.esm.js"></script>
		<script nomodule src="/build/myplayground.js"></script>
		<style>html {color-scheme: light dark; color: light-dark(#0e0e0e, #f5f5f5);	background-color: light-dark(#fff, #2e3235); } body { margin: 0; font-family: system-ui; }</style>
	</head>
	<body>
		<my-greeting></my-greeting>
	</body>
</html>`
				}
			},
			'index.ts': {
				file: {
					contents: `export type * from './components.d.ts';`
				}
			},
			components: {
				directory: {
					'index.ts': {
						file: {
							contents: `export * from './my-greeting/my-greeting';`
						}
					},
					'my-greeting': {
						directory: {
							'my-greeting.tsx': {
								file: {
									contents: `import { Component, Prop, h } from '@stencil/core';
@Component({ tag: 'my-greeting', styleUrl: 'my-greeting.css', shadow: true })
export class MyGreeting {
  @Prop() name: string = 'World';
  render() { return (<div>Hello, {this.name}!</div>); }
}`
								}
							},
							'my-greeting.css': {
								file: {
									contents: `:host { display:block; margin-block-end: 1rem; }
div { font-weight: bold; }`
								}
							}
						}
					}
				}
			}
		}
	}
};
