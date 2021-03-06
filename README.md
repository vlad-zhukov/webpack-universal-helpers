# webpack-universal-helpers · [![npm](https://img.shields.io/npm/v/webpack-universal-helpers.svg)](https://npm.im/webpack-universal-helpers)

> Just a few helpers for building universal apps with [webpack](https://webpack.js.org/).

Designed to be used with `webpack@3`.

## Table of Content

- [CLI](#cli)
  - [`webpack-universal`](#webpack-universal)
- [API](#api)
  - [`nodeExternals([options])`](#nodeexternals)
  - [`watchServer([options])`](#watchserver)

## CLI

### `webpack-universal`

__Arguments__

1. `bundle` _(String)_: Path to bundle to start.
2. `[config]` _(String)_: Defaults to `webpack.config.js`.
3. `[cwd]` _(String)_
4. `[hot]` _(Boolean)_: Defaults to `false`.

## API

### `nodeExternals(options)`

__Arguments__

1. `options` _(Object)_:
   - `[pathToPackageJson]` _(String)_
   - `[packageJsonSections]` _(Array\<String\>)_: Defaults to `['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']`.
   - `[pathToNodeModules]` _(String)_
   - `[excludeNodeModulesDirs]` _(Function|Array\<String\>|Regex|String)_
   - `[whitelistModules]` _(Function|Array\<String\>|Regex|String)_
   - `[createImport]` _(Function)_: Defaults to `module => 'commonjs' + module`.
   - `[includeAbsolutePaths]` _(Booldean)_: Defaults to `false`.

---

### `watchServer(options)`

__Arguments__

1. `options` _(Object)_:
   - `webpackConfig` _(String)_
   - `bundlePath` _(String)_
   - `cwd` _(String)_
   - `hot` _(Boolean)_

---
