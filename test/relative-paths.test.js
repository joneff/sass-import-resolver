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

suite('_resolve relative paths', () => {

    context('_resolve(file.ext)', () => {
        dirMatrix.forEach((dir) => {
            fileMathrix.forEach((filePath) => {

                test(`@import ${dir}${filePath} resolves correctly`, () =>{
                    let file = `${dir}${filePath}`;
                    let matches = _resolve({ file });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}`));
                });

            });
        });
    });

    context('_resolve(file.ext, { prev })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                fileMathrix.forEach((filePath) => {

                    test(`@import ${dir}${filePath} from ${prev} resolves correctly`, () =>{
                        let file = `${dir}${filePath}`;
                        let matches = _resolve({ file, prev });
                        let prevResolved = path.extname(prev) === '' ? prev : path.dirname(prev);

                        assert.strictEqual(matches.length, 1);
                        assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}`));
                    });

                });
            });
        });
    });

    context('_resolve(file.ext, { includePaths })', () => {
        dirMatrix.forEach((dir) => {
            fileMathrix.forEach((filePath) => {

                test(`@import ${dir}${filePath} with includePaths resolves correctly`, () =>{
                    let file = `${dir}${filePath}`;
                    let matches = _resolve({ file, includePaths });

                    if (file.startsWith('.')) {
                        assert.strictEqual(matches.length, 1);
                        assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}`));
                    } else {
                        assert.strictEqual(matches.length, 4);
                        assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}`));
                        assert.strictEqual(matches[1], path.resolve(includePaths[0], `${dir}${filePath}`));
                        assert.strictEqual(matches[2], path.resolve(includePaths[1], `${dir}${filePath}`));
                        assert.strictEqual(matches[3], path.resolve(includePaths[2], `${dir}${filePath}`));
                    }
                });

            });
        });
    });

    context('_resolve(file.ext, { prev, includePaths })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                fileMathrix.forEach((filePath) => {

                    test(`@import ${dir}${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                        let file = `${dir}${filePath}`;
                        let matches = _resolve({ file, prev, includePaths });
                        let prevResolved = path.extname(prev) === '' ? prev : path.dirname(prev);

                        if (file.startsWith('.')) {
                            assert.strictEqual(matches.length, 1);
                            assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}`));
                        } else {
                            assert.strictEqual(matches.length, 4);
                            assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}`));
                            assert.strictEqual(matches[1], path.resolve(includePaths[0], `${dir}${filePath}`));
                            assert.strictEqual(matches[2], path.resolve(includePaths[1], `${dir}${filePath}`));
                            assert.strictEqual(matches[3], path.resolve(includePaths[2], `${dir}${filePath}`));
                        }
                    });

                });
            });
        });
    });

    context('_resolve(ambiguous)', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((filePath) => {

                test(`@import ${dir}${filePath} resolves correctly`, () =>{
                    let file = `${dir}${filePath}`;
                    let matches = _resolve({ file });

                    if (filePath.startsWith('_')) {
                        assert.strictEqual(matches.length, 7);
                        assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve(`${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve(`${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve(`${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[4], path.resolve(`${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[5], path.resolve(`${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[6], path.resolve(`${dir}${filePath}/_index.sass`));
                    } else {
                        assert.strictEqual(matches.length, 9);
                        assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}.css`));
                        assert.strictEqual(matches[1], path.resolve(`${dir}${filePath}.scss`));
                        assert.strictEqual(matches[2], path.resolve(`${dir}${filePath}.sass`));
                        assert.strictEqual(matches[3], path.resolve(`${dir}_${filePath}.scss`));
                        assert.strictEqual(matches[4], path.resolve(`${dir}_${filePath}.sass`));
                        assert.strictEqual(matches[5], path.resolve(`${dir}${filePath}/index.scss`));
                        assert.strictEqual(matches[6], path.resolve(`${dir}${filePath}/index.sass`));
                        assert.strictEqual(matches[7], path.resolve(`${dir}${filePath}/_index.scss`));
                        assert.strictEqual(matches[8], path.resolve(`${dir}${filePath}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(ambiguous, { prev })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((filePath) => {

                    test(`@import ${dir}${filePath} from ${prev} resolves correctly`, () =>{
                        let file = `${dir}${filePath}`;
                        let matches = _resolve({ file, prev });
                        let prevResolved = path.extname(prev) === '' ? prev : path.dirname(prev);

                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 7);
                            assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(prevResolved, `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(prevResolved, `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(prevResolved, `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve(prevResolved, `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve(prevResolved, `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve(prevResolved, `${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 9);
                            assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(prevResolved, `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(prevResolved, `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(prevResolved, `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve(prevResolved, `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve(prevResolved, `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve(prevResolved, `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve(prevResolved, `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve(prevResolved, `${dir}${filePath}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

    context('_resolve(ambiguous, { includePaths })', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((filePath) => {

                test(`@import ${dir}${filePath} with includePaths resolves correctly`, () =>{
                    let file = `${dir}${filePath}`;
                    let matches = _resolve({ file, includePaths });

                    if (file.startsWith('.')) {
                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 7);
                            assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(`${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(`${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(`${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve(`${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve(`${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve(`${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 9);
                            assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(`${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(`${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(`${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve(`${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve(`${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve(`${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve(`${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve(`${dir}${filePath}/_index.sass`));
                        }
                    } else {
                        if (filePath.startsWith('_')) {
                            assert.strictEqual(matches.length, 28);
                            assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(`${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(`${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(`${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[4], path.resolve(`${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[5], path.resolve(`${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[6], path.resolve(`${dir}${filePath}/_index.sass`));
                            assert.strictEqual(matches[7], path.resolve(includePaths[0], `${dir}${filePath}.css`));
                            assert.strictEqual(matches[8], path.resolve(includePaths[0], `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[9], path.resolve(includePaths[0], `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[10], path.resolve(includePaths[0], `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[11], path.resolve(includePaths[0], `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[12], path.resolve(includePaths[0], `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[13], path.resolve(includePaths[0], `${dir}${filePath}/_index.sass`));
                            assert.strictEqual(matches[14], path.resolve(includePaths[1], `${dir}${filePath}.css`));
                            assert.strictEqual(matches[15], path.resolve(includePaths[1], `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[16], path.resolve(includePaths[1], `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[17], path.resolve(includePaths[1], `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[18], path.resolve(includePaths[1], `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[19], path.resolve(includePaths[1], `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[20], path.resolve(includePaths[1], `${dir}${filePath}/_index.sass`));
                            assert.strictEqual(matches[21], path.resolve(includePaths[2], `${dir}${filePath}.css`));
                            assert.strictEqual(matches[22], path.resolve(includePaths[2], `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[23], path.resolve(includePaths[2], `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[24], path.resolve(includePaths[2], `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[25], path.resolve(includePaths[2], `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[26], path.resolve(includePaths[2], `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[27], path.resolve(includePaths[2], `${dir}${filePath}/_index.sass`));
                        } else {
                            assert.strictEqual(matches.length, 36);
                            assert.strictEqual(matches[0], path.resolve(`${dir}${filePath}.css`));
                            assert.strictEqual(matches[1], path.resolve(`${dir}${filePath}.scss`));
                            assert.strictEqual(matches[2], path.resolve(`${dir}${filePath}.sass`));
                            assert.strictEqual(matches[3], path.resolve(`${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[4], path.resolve(`${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[5], path.resolve(`${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[6], path.resolve(`${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[7], path.resolve(`${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[8], path.resolve(`${dir}${filePath}/_index.sass`));
                            assert.strictEqual(matches[9], path.resolve(includePaths[0], `${dir}${filePath}.css`));
                            assert.strictEqual(matches[10], path.resolve(includePaths[0], `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[11], path.resolve(includePaths[0], `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[12], path.resolve(includePaths[0], `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[13], path.resolve(includePaths[0], `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[14], path.resolve(includePaths[0], `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[15], path.resolve(includePaths[0], `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[16], path.resolve(includePaths[0], `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[17], path.resolve(includePaths[0], `${dir}${filePath}/_index.sass`));
                            assert.strictEqual(matches[18], path.resolve(includePaths[1], `${dir}${filePath}.css`));
                            assert.strictEqual(matches[19], path.resolve(includePaths[1], `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[20], path.resolve(includePaths[1], `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[21], path.resolve(includePaths[1], `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[22], path.resolve(includePaths[1], `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[23], path.resolve(includePaths[1], `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[24], path.resolve(includePaths[1], `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[25], path.resolve(includePaths[1], `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[26], path.resolve(includePaths[1], `${dir}${filePath}/_index.sass`));
                            assert.strictEqual(matches[27], path.resolve(includePaths[2], `${dir}${filePath}.css`));
                            assert.strictEqual(matches[28], path.resolve(includePaths[2], `${dir}${filePath}.scss`));
                            assert.strictEqual(matches[29], path.resolve(includePaths[2], `${dir}${filePath}.sass`));
                            assert.strictEqual(matches[30], path.resolve(includePaths[2], `${dir}_${filePath}.scss`));
                            assert.strictEqual(matches[31], path.resolve(includePaths[2], `${dir}_${filePath}.sass`));
                            assert.strictEqual(matches[32], path.resolve(includePaths[2], `${dir}${filePath}/index.scss`));
                            assert.strictEqual(matches[33], path.resolve(includePaths[2], `${dir}${filePath}/index.sass`));
                            assert.strictEqual(matches[34], path.resolve(includePaths[2], `${dir}${filePath}/_index.scss`));
                            assert.strictEqual(matches[35], path.resolve(includePaths[2], `${dir}${filePath}/_index.sass`));
                        }
                    }
                });

            });
        });
    });

    context('_resolve(ambiguous, { prev, includePaths })', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((filePath) => {

                    test(`@import ${dir}${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                        let file = `${dir}${filePath}`;
                        let matches = _resolve({ file, prev, includePaths });
                        let prevResolved = path.extname(prev) === '' ? prev : path.dirname(prev);

                        if (file.startsWith('.')) {
                            if (filePath.startsWith('_')) {
                                assert.strictEqual(matches.length, 7);
                                assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}.css`));
                                assert.strictEqual(matches[1], path.resolve(prevResolved, `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[2], path.resolve(prevResolved, `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[3], path.resolve(prevResolved, `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[4], path.resolve(prevResolved, `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[5], path.resolve(prevResolved, `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[6], path.resolve(prevResolved, `${dir}${filePath}/_index.sass`));
                            } else {
                                assert.strictEqual(matches.length, 9);
                                assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}.css`));
                                assert.strictEqual(matches[1], path.resolve(prevResolved, `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[2], path.resolve(prevResolved, `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[3], path.resolve(prevResolved, `${dir}_${filePath}.scss`));
                                assert.strictEqual(matches[4], path.resolve(prevResolved, `${dir}_${filePath}.sass`));
                                assert.strictEqual(matches[5], path.resolve(prevResolved, `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[6], path.resolve(prevResolved, `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[7], path.resolve(prevResolved, `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[8], path.resolve(prevResolved, `${dir}${filePath}/_index.sass`));
                            }
                        } else {
                            if (filePath.startsWith('_')) {
                                assert.strictEqual(matches.length, 28);
                                assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}.css`));
                                assert.strictEqual(matches[1], path.resolve(prevResolved, `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[2], path.resolve(prevResolved, `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[3], path.resolve(prevResolved, `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[4], path.resolve(prevResolved, `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[5], path.resolve(prevResolved, `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[6], path.resolve(prevResolved, `${dir}${filePath}/_index.sass`));
                                assert.strictEqual(matches[7], path.resolve(includePaths[0], `${dir}${filePath}.css`));
                                assert.strictEqual(matches[8], path.resolve(includePaths[0], `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[9], path.resolve(includePaths[0], `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[10], path.resolve(includePaths[0], `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[11], path.resolve(includePaths[0], `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[12], path.resolve(includePaths[0], `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[13], path.resolve(includePaths[0], `${dir}${filePath}/_index.sass`));
                                assert.strictEqual(matches[14], path.resolve(includePaths[1], `${dir}${filePath}.css`));
                                assert.strictEqual(matches[15], path.resolve(includePaths[1], `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[16], path.resolve(includePaths[1], `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[17], path.resolve(includePaths[1], `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[18], path.resolve(includePaths[1], `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[19], path.resolve(includePaths[1], `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[20], path.resolve(includePaths[1], `${dir}${filePath}/_index.sass`));
                                assert.strictEqual(matches[21], path.resolve(includePaths[2], `${dir}${filePath}.css`));
                                assert.strictEqual(matches[22], path.resolve(includePaths[2], `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[23], path.resolve(includePaths[2], `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[24], path.resolve(includePaths[2], `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[25], path.resolve(includePaths[2], `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[26], path.resolve(includePaths[2], `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[27], path.resolve(includePaths[2], `${dir}${filePath}/_index.sass`));
                            } else {
                                assert.strictEqual(matches.length, 36);
                                assert.strictEqual(matches[0], path.resolve(prevResolved, `${dir}${filePath}.css`));
                                assert.strictEqual(matches[1], path.resolve(prevResolved, `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[2], path.resolve(prevResolved, `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[3], path.resolve(prevResolved, `${dir}_${filePath}.scss`));
                                assert.strictEqual(matches[4], path.resolve(prevResolved, `${dir}_${filePath}.sass`));
                                assert.strictEqual(matches[5], path.resolve(prevResolved, `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[6], path.resolve(prevResolved, `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[7], path.resolve(prevResolved, `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[8], path.resolve(prevResolved, `${dir}${filePath}/_index.sass`));
                                assert.strictEqual(matches[9], path.resolve(includePaths[0], `${dir}${filePath}.css`));
                                assert.strictEqual(matches[10], path.resolve(includePaths[0], `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[11], path.resolve(includePaths[0], `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[12], path.resolve(includePaths[0], `${dir}_${filePath}.scss`));
                                assert.strictEqual(matches[13], path.resolve(includePaths[0], `${dir}_${filePath}.sass`));
                                assert.strictEqual(matches[14], path.resolve(includePaths[0], `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[15], path.resolve(includePaths[0], `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[16], path.resolve(includePaths[0], `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[17], path.resolve(includePaths[0], `${dir}${filePath}/_index.sass`));
                                assert.strictEqual(matches[18], path.resolve(includePaths[1], `${dir}${filePath}.css`));
                                assert.strictEqual(matches[19], path.resolve(includePaths[1], `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[20], path.resolve(includePaths[1], `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[21], path.resolve(includePaths[1], `${dir}_${filePath}.scss`));
                                assert.strictEqual(matches[22], path.resolve(includePaths[1], `${dir}_${filePath}.sass`));
                                assert.strictEqual(matches[23], path.resolve(includePaths[1], `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[24], path.resolve(includePaths[1], `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[25], path.resolve(includePaths[1], `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[26], path.resolve(includePaths[1], `${dir}${filePath}/_index.sass`));
                                assert.strictEqual(matches[27], path.resolve(includePaths[2], `${dir}${filePath}.css`));
                                assert.strictEqual(matches[28], path.resolve(includePaths[2], `${dir}${filePath}.scss`));
                                assert.strictEqual(matches[29], path.resolve(includePaths[2], `${dir}${filePath}.sass`));
                                assert.strictEqual(matches[30], path.resolve(includePaths[2], `${dir}_${filePath}.scss`));
                                assert.strictEqual(matches[31], path.resolve(includePaths[2], `${dir}_${filePath}.sass`));
                                assert.strictEqual(matches[32], path.resolve(includePaths[2], `${dir}${filePath}/index.scss`));
                                assert.strictEqual(matches[33], path.resolve(includePaths[2], `${dir}${filePath}/index.sass`));
                                assert.strictEqual(matches[34], path.resolve(includePaths[2], `${dir}${filePath}/_index.scss`));
                                assert.strictEqual(matches[35], path.resolve(includePaths[2], `${dir}${filePath}/_index.sass`));
                            }
                        }
                    });

                });
            });
        });
    });

});
