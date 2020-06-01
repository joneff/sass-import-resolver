const fs = require('fs');
const path = require('path');
const reExt = /\.(css|scss|sass)$/;

const isExternal = (url) => {
    return url.startsWith('http') || url.startsWith('//') || url.startsWith('url(');
};

const defaultOptions = {
    prev: '',
    includePaths: [],
    nodeModules: './node_modules'
};

const _resolve = (url, options = {}) => {
    let file;
    let prev = options.prev || defaultOptions.prev;
    let includePaths = options.includePaths || defaultOptions.includePaths;
    let nodeModules = options.nodeModules || defaultOptions.nodeModules;
    let cwd = path.extname(prev) ? path.dirname(prev) : prev;
    let meta = path.parse(url);
    let matches = new Set();

    // Skip external stylesheets
    if (isExternal(url)) {
        return [ url ];
    }

    // Absolute path
    if (url.startsWith('/')) {
        cwd = '';
        includePaths = [];
    }

    // node_modules import
    if (url.startsWith('~')) {
        meta = path.parse(url.slice(1));
        cwd = path.resolve(nodeModules);
        includePaths = [];
    }

    // Import from parent
    if (url.startsWith('../') || url.startsWith('./../')) {
        includePaths = [];
    }

    // Only unique paths
    includePaths = new Set([ cwd, ...includePaths ]);

    includePaths.forEach(( dir ) => {
        file = path.resolve(dir, path.format(meta));

        // Has extension
        if ( reExt.test(file) ) {
            matches.add(file);
        } else {
            // No extension
            if (meta.base.startsWith('_')) {
                matches.add(path.resolve(dir, meta.dir, `${meta.base}.css`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}.scss`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}.sass`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/index.scss`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/index.sass`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/_index.scss`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/_index.sass`));
            } else {
                matches.add(path.resolve(dir, meta.dir, `${meta.base}.css`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}.scss`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}.sass`));
                matches.add(path.resolve(dir, meta.dir, `_${meta.base}.scss`));
                matches.add(path.resolve(dir, meta.dir, `_${meta.base}.sass`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/index.scss`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/index.sass`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/_index.scss`));
                matches.add(path.resolve(dir, meta.dir, `${meta.base}/_index.sass`));
            }
        }

    });

    return [ ...matches ];

};

const resolve = (url, options) => {

    let resolved = _resolve(url, options);
    let existing = [];

    if (resolved.length && isExternal(resolved[0])) {
        return url;
    }

    resolved.forEach((file) => {
        if (fs.existsSync(file)) {
            existing.push(file);
        }
    });

    return existing[0] || url;
};

module.exports = {
    _resolve,
    resolve
};
