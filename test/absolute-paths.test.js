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
    "",
    '/path/to/dir',
    '/path/to/file.ext'
];
const files = [
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

suite('_resolve absolute paths', () => {

    context('_resolve(/file.ext)', () => {
        dirMatrix.forEach((dir) => {
            files.forEach((file) => {

                test(`@import /${dir}${file} resolves correctly`, () =>{
                    let url = `/${dir}${file}`;
                    let matches = _resolve(url);

                    assert.equal(matches.length, 1);
                    assert.equal(matches[0], path.resolve('/', `${dir}${file}`));
                });

            });
        });
    });

    context('_resolve(/file.ext, prev)', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                files.forEach((file) => {

                    test(`@import /${dir}${file} from ${prev} resolves correctly`, () =>{
                        let url = `/${dir}${file}`;
                        let matches = _resolve(url, prev);

                        assert.equal(matches.length, 1);
                        assert.equal(matches[0], path.resolve('/', `${dir}${file}`));
                    });

                });
            });
        });
    });

    context('_resolve(/file.ext, includePaths)', () => {
        dirMatrix.forEach((dir) => {
            files.forEach((file) => {

                test(`@import /${dir}${file} with includePaths resolves correctly`, () =>{
                    let url = `/${dir}${file}`;
                    let matches = _resolve(url, '', includePaths);

                    assert.equal(matches.length, 1);
                    assert.equal(matches[0], path.resolve('/', `${dir}${file}`));
                });

            });
        });
    });

    context('_resolve(/file.ext, prev, includePaths)', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                files.forEach((file) => {

                    test(`@import /${dir}${file} from ${prev} with includePaths resolves correctly`, () =>{
                        let url = `/${dir}${file}`;
                        let matches = _resolve(url, prev, includePaths);

                        assert.equal(matches.length, 1);
                        assert.equal(matches[0], path.resolve('/', `${dir}${file}`));
                    });

                });
            });
        });
    });

    context('_resolve(/ambiguous)', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((file) => {

                test(`@import /${dir}${file} resolves correctly`, () =>{
                    let url = `/${dir}${file}`;
                    let matches = _resolve(url);

                    if (file.startsWith('_')) {
                        assert.equal(matches.length, 7);
                        assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                        assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                        assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                        assert.equal(matches[3], path.resolve('/', `${dir}${file}/index.scss`));
                        assert.equal(matches[4], path.resolve('/', `${dir}${file}/index.sass`));
                        assert.equal(matches[5], path.resolve('/', `${dir}${file}/_index.scss`));
                        assert.equal(matches[6], path.resolve('/', `${dir}${file}/_index.sass`));
                    } else {
                        assert.equal(matches.length, 9);
                        assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                        assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                        assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                        assert.equal(matches[3], path.resolve('/', `${dir}_${file}.scss`));
                        assert.equal(matches[4], path.resolve('/', `${dir}_${file}.sass`));
                        assert.equal(matches[5], path.resolve('/', `${dir}${file}/index.scss`));
                        assert.equal(matches[6], path.resolve('/', `${dir}${file}/index.sass`));
                        assert.equal(matches[7], path.resolve('/', `${dir}${file}/_index.scss`));
                        assert.equal(matches[8], path.resolve('/', `${dir}${file}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(/ambiguous, prev)', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((file) => {

                    test(`@import /${dir}${file} from ${prev} resolves correctly`, () =>{
                        let url = `/${dir}${file}`;
                        let matches = _resolve(url, prev);

                        if (file.startsWith('_')) {
                            assert.equal(matches.length, 7);
                            assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                            assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                            assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                            assert.equal(matches[3], path.resolve('/', `${dir}${file}/index.scss`));
                            assert.equal(matches[4], path.resolve('/', `${dir}${file}/index.sass`));
                            assert.equal(matches[5], path.resolve('/', `${dir}${file}/_index.scss`));
                            assert.equal(matches[6], path.resolve('/', `${dir}${file}/_index.sass`));
                        } else {
                            assert.equal(matches.length, 9);
                            assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                            assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                            assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                            assert.equal(matches[3], path.resolve('/', `${dir}_${file}.scss`));
                            assert.equal(matches[4], path.resolve('/', `${dir}_${file}.sass`));
                            assert.equal(matches[5], path.resolve('/', `${dir}${file}/index.scss`));
                            assert.equal(matches[6], path.resolve('/', `${dir}${file}/index.sass`));
                            assert.equal(matches[7], path.resolve('/', `${dir}${file}/_index.scss`));
                            assert.equal(matches[8], path.resolve('/', `${dir}${file}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

    context('_resolve(/ambiguous, includePaths)', () => {
        dirMatrix.forEach((dir) => {
            ambiguousFiles.forEach((file) => {

                test(`@import /${dir}${file} with includePaths resolves correctly`, () =>{
                    let url = `/${dir}${file}`;
                    let matches = _resolve(url, '', includePaths);

                    if (file.startsWith('_')) {
                        assert.equal(matches.length, 7);
                        assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                        assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                        assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                        assert.equal(matches[3], path.resolve('/', `${dir}${file}/index.scss`));
                        assert.equal(matches[4], path.resolve('/', `${dir}${file}/index.sass`));
                        assert.equal(matches[5], path.resolve('/', `${dir}${file}/_index.scss`));
                        assert.equal(matches[6], path.resolve('/', `${dir}${file}/_index.sass`));
                    } else {
                        assert.equal(matches.length, 9);
                        assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                        assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                        assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                        assert.equal(matches[3], path.resolve('/', `${dir}_${file}.scss`));
                        assert.equal(matches[4], path.resolve('/', `${dir}_${file}.sass`));
                        assert.equal(matches[5], path.resolve('/', `${dir}${file}/index.scss`));
                        assert.equal(matches[6], path.resolve('/', `${dir}${file}/index.sass`));
                        assert.equal(matches[7], path.resolve('/', `${dir}${file}/_index.scss`));
                        assert.equal(matches[8], path.resolve('/', `${dir}${file}/_index.sass`));
                    }
                });

            });
        });
    });

    context('_resolve(/ambiguous, prev, includePaths)', () => {
        dirMatrix.forEach((dir) => {
            prevMatrix.forEach((prev) =>{
                ambiguousFiles.forEach((file) => {

                    test(`@import /${dir}${file} from ${prev} with includePaths resolves correctly`, () =>{
                        let url = `/${dir}${file}`;
                        let matches = _resolve(url, prev, includePaths);

                        if (file.startsWith('_')) {
                            assert.equal(matches.length, 7);
                            assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                            assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                            assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                            assert.equal(matches[3], path.resolve('/', `${dir}${file}/index.scss`));
                            assert.equal(matches[4], path.resolve('/', `${dir}${file}/index.sass`));
                            assert.equal(matches[5], path.resolve('/', `${dir}${file}/_index.scss`));
                            assert.equal(matches[6], path.resolve('/', `${dir}${file}/_index.sass`));
                        } else {
                            assert.equal(matches.length, 9);
                            assert.equal(matches[0], path.resolve('/', `${dir}${file}.css`));
                            assert.equal(matches[1], path.resolve('/', `${dir}${file}.scss`));
                            assert.equal(matches[2], path.resolve('/', `${dir}${file}.sass`));
                            assert.equal(matches[3], path.resolve('/', `${dir}_${file}.scss`));
                            assert.equal(matches[4], path.resolve('/', `${dir}_${file}.sass`));
                            assert.equal(matches[5], path.resolve('/', `${dir}${file}/index.scss`));
                            assert.equal(matches[6], path.resolve('/', `${dir}${file}/index.sass`));
                            assert.equal(matches[7], path.resolve('/', `${dir}${file}/_index.scss`));
                            assert.equal(matches[8], path.resolve('/', `${dir}${file}/_index.sass`));
                        }
                    });

                });
            });
        });
    });

});
