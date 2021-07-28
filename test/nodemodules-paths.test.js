const path = require('path');
const assert = require('assert');
const suite = require('mocha').suite;
const context = require('mocha').describe;
const test = require('mocha').test;

const _resolve = require('../index')._resolve;
const dirMatrix = [
    // Relative siblings
    '', './',
    // Relative child
    'dir/', './dir/',
    // Relative parent
    '../', './../', '../dir/', './../dir/',
];
const prevMatrix = [
    '',
    '/path/to/dir',
    '/path/to/file.ext'
];
const fileMathrix = [
    'file.css',     '_file.css',    // eslint-disable-line no-multi-spaces
    'file.scss',    '_file.scss',   // eslint-disable-line no-multi-spaces
    'file.sass',    '_file.sass'    // eslint-disable-line no-multi-spaces
];
const ambiguousFiles = [
    'file.fake',    '_file.fake',   // eslint-disable-line no-multi-spaces
    'ambiguous',    '_ambiguous'    // eslint-disable-line no-multi-spaces
];
const includePaths = [
    '/',
    'node_modules',
    'random/path',
    '/',
    'node_modules',
    'random/path'
];

suite('_resolve node_modules paths', () => {

    context('_resolve(~file.ext)', () => {
        dirMatrix.forEach((dir) => {
            fileMathrix.forEach((filePath) => {

                test(`@import ~${dir}${filePath} resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}`));
                });

            });
        });
    });

    context('_resolve(~file.ext, { prev })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                fileMathrix.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, prev });

                        assert.strictEqual(matches.length, 1);
                        assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}`));
                    });

                });
            });
        });
    });

    context('_resolve(~file.ext, { includePaths })', () => {
        dirMatrix.forEach((dir) => {
            fileMathrix.forEach((filePath) => {

                test(`@import ~${dir}${filePath} with includePaths resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file, includePaths });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}`));
                });

            });
        });
    });

    context('_resolve(~file.ext, { prev, includePaths })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                fileMathrix.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, prev, includePaths });

                        assert.strictEqual(matches.length, 1);
                        assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}`));
                    });

                });
            });
        });
    });

    context('_resolve(~ambiguous)', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((filePath) => {

                test(`@import ~${dir}${filePath} resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file });

                    if (filePath.startsWith('_')) {
                        assert.strictEqual(matches.length, 7);
                        assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                    } else {
                        assert.strictEqual(matches.length, 9);
                        assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}_${filePath}.scss`));
                        assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}_${filePath}.sass`));
                        assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[7], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[8], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(~ambiguous, { prev })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, prev });

                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 7);
                            assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 9);
                            assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

    context('_resolve(~ambiguous, { includePaths })', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((filePath) => {

                test(`@import ~${dir}${filePath} with includePaths resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file, includePaths });

                    if (filePath.startsWith('_')) {
                        assert.strictEqual(matches.length, 7);
                        assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                    } else {
                        assert.strictEqual(matches.length, 9);
                        assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}_${filePath}.scss`));
                        assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}_${filePath}.sass`));
                        assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[7], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[8], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(~ambiguous, { prev, includePaths })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, prev, includePaths });

                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 7);
                            assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 9);
                            assert.strictEqual(matches[0], path.resolve('node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve('node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve('node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve('node_modules', `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve('node_modules', `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve('node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve('node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve('node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve('node_modules', `${dir}${filePath}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

});


suite('_resolve node_modules paths with custom node_modules', () => {

    context('_resolve(~file.ext)', () => {
        dirMatrix.forEach((dir) => {
            fileMathrix.forEach((filePath) => {

                test(`@import ~${dir}${filePath} resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ) });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], path.resolve( dir, 'node_modules', `${dir}${filePath}`));
                });

            });
        });
    });

    context('_resolve(~file.ext, { prev })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                fileMathrix.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ), prev });

                        assert.strictEqual(matches.length, 1);
                        assert.strictEqual(matches[0], path.resolve( dir, 'node_modules', `${dir}${filePath}`));
                    });

                });
            });
        });
    });

    context('_resolve(~file.ext, { includePaths })', () => {
        dirMatrix.forEach((dir) => {
            fileMathrix.forEach((filePath) => {

                test(`@import ~${dir}${filePath} with includePaths resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ), includePaths });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}`));
                });

            });
        });
    });

    context('_resolve(~file.ext, { prev, includePaths })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                fileMathrix.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ), prev, includePaths });

                        assert.strictEqual(matches.length, 1);
                        assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}`));
                    });

                });
            });
        });
    });

    context('_resolve(~ambiguous)', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((filePath) => {

                test(`@import ~${dir}${filePath} resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ) });

                    if (filePath.startsWith('_')) {
                        assert.strictEqual(matches.length, 7);
                        assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                    } else {
                        assert.strictEqual(matches.length, 9);
                        assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}_${filePath}.scss`));
                        assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}_${filePath}.sass`));
                        assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[7], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[8], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(~ambiguous, { prev })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ), prev });

                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 7);
                            assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 9);
                            assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

    context('_resolve(~ambiguous, { includePaths })', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((filePath) => {

                test(`@import ~${dir}${filePath} with includePaths resolves correctly`, () =>{
                    let file = `~${dir}${filePath}`;
                    let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ), includePaths });

                    if (filePath.startsWith('_')) {
                        assert.strictEqual(matches.length, 7);
                        assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                    } else {
                        assert.strictEqual(matches.length, 9);
                        assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}_${filePath}.scss`));
                        assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}_${filePath}.sass`));
                        assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[7], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[8], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(~ambiguous, { prev, includePaths })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((filePath) => {

                    test(`@import ~${dir}${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                        let file = `~${dir}${filePath}`;
                        let matches = _resolve({ file, nodeModules: path.resolve( dir, 'node_modules' ), prev, includePaths });

                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 7);
                            assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 9);
                            assert.strictEqual(matches[0], path.resolve(dir, 'node_modules', `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(dir, 'node_modules', `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(dir, 'node_modules', `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(dir, 'node_modules', `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve(dir, 'node_modules', `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve(dir, 'node_modules', `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve(dir, 'node_modules', `${dir}${filePath}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

});
