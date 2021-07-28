const assert = require('assert');
const suite = require('mocha').suite;
const context = require('mocha').describe;
const test = require('mocha').test;

const _resolve = require('../index')._resolve;
const fileMathrix = [
    '//example.com/resource',
    'http://example.com/resource',
    'https://exmaple.com/resource',
    'url(example.com/resource)'
];
const prevMatrix = [
    '',
    '/path/to/dir',
    '/path/to/file.ext'
];
const includePaths = [
    '/',
    'node_modules',
    'random/path',
    '/',
    'node_modules',
    'random/path'
];

suite('_resolve external paths', () => {

    context('_resolve(external)', () => {
        fileMathrix.forEach((filePath) => {

            test(`@import ${filePath} resolves correctly`, () =>{
                let file = `${filePath}`;
                let matches = _resolve({ file });

                assert.strictEqual(matches.length, 1);
                assert.strictEqual(matches[0], file);
            });

        });
    });

    context('_resolve(external, { prev })', () => {
        fileMathrix.forEach((filePath) => {
            prevMatrix.forEach((prev) => {

                test(`@import ${filePath} from ${prev} resolves correctly`, () =>{
                    let file = `${filePath}`;
                    let matches = _resolve({ file, prev });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], file);
                });

            });
        });
    });

    context('_resolve(external, { includePaths })', () => {
        fileMathrix.forEach((filePath) => {

            test(`@import ${filePath} with includePaths resolves correctly`, () =>{
                let file = `${filePath}`;
                let matches = _resolve({ file, includePaths });

                assert.strictEqual(matches.length, 1);
                assert.strictEqual(matches[0], file);
            });

        });
    });

    context('_resolve(external, { prev, includePaths })', () => {
        fileMathrix.forEach((filePath) => {
            prevMatrix.forEach((prev) => {

                test(`@import ${filePath} from ${prev} with includePaths resolves correctly`, () =>{
                    let file = `${filePath}`;
                    let matches = _resolve({ file, prev, includePaths });

                    assert.strictEqual(matches.length, 1);
                    assert.strictEqual(matches[0], file);
                });

            });
        });
    });

});
