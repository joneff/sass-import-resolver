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

    context(`_resolve(external)`, () => {
        fileMathrix.forEach((file) => {

            test(`@import ${file} resolves correctly`, () =>{
                let url = `${file}`;
                let matches = _resolve(url);

                assert.equal(matches.length, 1);
                assert.equal(matches[0], url);
            });

        });
    });

    context('_resolve(external, { prev })', () => {
        fileMathrix.forEach((file) => {
            prevMatrix.forEach((prev) => {

                test(`@import ${file} from ${prev} resolves correctly`, () =>{
                    let url = `${file}`;
                    let matches = _resolve(url, { prev });

                    assert.equal(matches.length, 1);
                    assert.equal(matches[0], url);
                });

            });
        });
    });

    context('_resolve(external, { includePaths })', () => {
        fileMathrix.forEach((file) => {

            test(`@import ${file} with includePaths resolves correctly`, () =>{
                let url = `${file}`;
                let matches = _resolve(url, { includePaths });

                assert.equal(matches.length, 1);
                assert.equal(matches[0], url);
            });

        });
    });

    context('_resolve(external, { prev, includePaths })', () => {
        fileMathrix.forEach((file) => {
            prevMatrix.forEach((prev) => {

                test(`@import ${file} from ${prev} with includePaths resolves correctly`, () =>{
                    let url = `${file}`;
                    let matches = _resolve(url, { prev, includePaths });

                    assert.equal(matches.length, 1);
                    assert.equal(matches[0], url);
                });

            });
        });
    });

});
