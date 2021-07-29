# sass-import-resolver

[sass-import-resolver] resolves the path of sass imports, following a heavily opinionated and probably very shady algorithm, which I will get to in a bit.

## Purpose

The purpose of the package is to be used for [sass importers] or similar scripts. The [API](#API) has similar signature to a sass importer.

## Installation

```shell
npm install @joneff/sass-import-resolver --save-dev
```

## Basic Usage

> It's probably not a good idea to use in any production code, without rigorous testing. Usage may feel a bit like a [Kübler-Ross] [grief cycle] -- denial, anger, barganing, depression, acceptance -- but it's the only sane solution I was able to come up with.
>
> -- me

Something like this will yield results:

```javascript
const resolver = require('@joneff/sass-import-resolver');

// assuming @import "../some/dependency.scss" in ./my/overly/nested/framework.scss
const file = ...;
const options = ...;

const result = resolver.resolve({ file, ...options });

console.log(result);
// if the file exists => ./my/overly/some/dependecy.scss
// if not => ../some/dependency.scss
```

## API

The api has only two methods with both using the same params.

### resolve()

* Signature: `function resolve( options: { file: String, prev?: String, includePaths?: Array<String>, nodeModules?: String } ) : String`

Just a facade -- passes everything down to `_resove` and waits for results.

### _resolve()

* Signature: `function _resolve( options: { file: String, prev?: String, includePaths?: Array<String>, nodeModules?: String } ) : Array<String>`

Does the actual work, collects **unique** matches and returns them.

### options

* `options.file` -- Path to a file
* `options.prev` (Optional) -- Path to file (or dir) to be used for resolving `url`. Ideally, it should not be empty and should be the previously resolved path.
* `options.includePaths` (Optional) -- An array of paths that the script can look in when attempting to resolve `@import` declarations. When resolving node_module (`~`), absolute (`/`) or parent (`../`) imports, this has no effect.
* `options.nodeModules` (Optional) -- Location of `node_modules` when resolving. Defaults to `./node_modules`.

## Heavily Opinionated and Probably Very Shady Algorithm

The algorithm is based on [Sass `@import` documentation], and should work as follows, assuming atleast `options.file` param is passed:

1) if `file` starts with `http://`, `https://`, `//`, `\\\\` or `url(`, it's not proccessed at all and returned as is;
2) if `prev` is file, set `cwd` to the directory that file is in;
3) if `prev` is directory, set `cwd` to that directory;
4) if `prev` is not passed, set `cwd` to `proccess.cwd()`;
5) if `includePaths` is not passed, assume it's an empty array;
6) if `file` is absolute path, clear `cwd` and `includePaths`;
7) if `file` starts with `~`, assume node_modules import, set `cwd` to `node_modules` and clear `includePaths`;
8) if `file` starts with `.`, clear `includePaths`;
9) assuming there are any `includePaths` left, unique them with `cwd` and loop them:
    1) if the file portion of `file` has `.css`, `.scss`, or `.sass` extension, resolve tha path and return it;
    2) if the file portion `file` starts with `_`, resolve and return the following 7 variants in that order:
        1) `_file.css`
        2) `_file.scss`
        3) `_file.sass`
        4) `file/index.scss` (that's an exception from sass @import)
        5) `file/index.sass`  (that's an exception from sass @import)
        6) `file/_index.scss`
        7) `file/_index.sass`
    3) resolve and return the following 9 variants in that order:
        1) `file.css`
        2) `file.scss`
        3) `file.sass`
        4) `_file.scss`
        5) `_file.sass`
        6) `file/index.scss` (that's an exception from sass @import)
        7) `file/index.sass`  (that's an exception from sass @import)
        8) `file/_index.scss`
        9) `file/_index.sass`
10) assuming there is an array of matches, loop over:
    1) return the resolved path of the first file that exists on the file system
    2) otherwise return the original `file`

Surely, the algorithm can be extended in various directions like scraping the `package.json` of resolved modules and looking for entry points, which is not a bad idea at all. However, if you are a sass package creator and you rely on such custom logic, things will not go well for consumers of said packages.

## Contributing?

Sure.

[sass-import-resolver]: https://github.com/joneff/sass-import-resolver
[sass importers]: https://github.com/sass/node-sass#importer--v200---experimental
[Kübler-Ross]: https://en.wikipedia.org/wiki/Elisabeth_K%C3%BCbler-Ross
[grief cycle]: https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model
[Sass `@import` documentation]: https://sass-lang.com/documentation/at-rules/import
