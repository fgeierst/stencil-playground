export const projectFiles = {
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          name: "stencil-minimal-webcontainer",
          version: "0.0.1",
          private: true,
          type: "module",
          dependencies: {
            "@stencil/core": "4.25.0",
          },
          scripts: {
            build: "stencil build",
            start: "stencil build --dev --watch --serve",
            test: 'echo "No tests configured" && exit 0',
          },
        },
        null,
        2
      ),
    },
  },
  "stencil.config.ts": {
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
};`,
    },
  },
  "tsconfig.json": {
    file: {
      contents: JSON.stringify(
        {
          compilerOptions: {
            allowSyntheticDefaultImports: true,
            experimentalDecorators: true,
            lib: ["dom", "es2017"],
            moduleResolution: "node",
            module: "esnext",
            target: "es2017",
            jsx: "react",
            jsxFactory: "h",
            allowJs: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
          },
          include: ["src"],
          exclude: ["node_modules"],
        },
        null,
        2
      ),
    },
  },
  src: {
    directory: {
      "index.html": {
        file: {
          contents: `<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
  <title>Stencil Dev Server</title>
  <script type="module" src="/build/myplayground.esm.js"></script>
  <script nomodule src="/build/myplayground.js"></script>
  <style> body { padding: 20px; font-family: sans-serif; background-color: #f9f9f9; } </style>
</head>
<body><h1>Stencil Component Test</h1><my-greeting name="WebContainer User"></my-greeting><my-greeting></my-greeting></body></html>`,
        },
      },
      "index.ts": {
        file: {
          contents: `export type * from './components.d.ts';`,
        },
      },
      components: {
        directory: {
          "index.ts": {
            file: {
              contents: `export * from './my-greeting/my-greeting';`,
            },
          },
          "my-greeting": {
            directory: {
              "my-greeting.tsx": {
                file: {
                  contents: `import { Component, Prop, h } from '@stencil/core';
@Component({ tag: 'my-greeting', styleUrl: 'my-greeting.css', shadow: true })
export class MyGreeting {
  @Prop() name: string = 'World';
  render() { return (<div>Hello, {this.name}! From @webcontainer/api.</div>); }
}`,
                },
              },
              "my-greeting.css": {
                file: {
                  contents: `:host { display: block; border: 2px dashed green; padding: 15px; margin: 10px; font-family: sans-serif; color: #111; background-color: #efe; }
div { font-weight: bold; }`,
                },
              },
            },
          },
        },
      },
    },
  },
};
