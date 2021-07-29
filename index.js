const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');

const reExt = /\.(css|scss|sass)$/;

const defaults = {
    prev: '',
    includePaths: [],
    nodeModules: './node_modules'
};

function isExternal(filePath) {
    return filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('//') || filePath.startsWith('\\\\') || filePath.startsWith('url(');
}

function _resolve( options ) {
    const opts = merge( {}, defaults, options );
    const {
        file,
        prev,
        nodeModules
    } = opts;
    let { includePaths } = opts;

    let candidte;
    let cwd = path.extname(prev) ? path.dirname(prev) : prev;
    let meta = path.parse(file);
    let matches = new Set();

    // Skip external stylesheets
    if (isExternal(file)) {
        return [ file ];
    }

    // Absolute path
    if (file.startsWith('/')) {
        cwd = '';
        includePaths = [];
    }

    // node_modules import
    if (file.startsWith('~')) {
        meta = path.parse(file.slice(1));
        cwd = path.resolve(nodeModules);
        includePaths = [];
    }

    // Import from parent
    if (file.startsWith('.')) {
        includePaths = [];
    }

    // Only unique paths
    includePaths = new Set([ cwd, ...includePaths ]);

    includePaths.forEach(( dir ) => {
        candidte = path.resolve(dir, path.format(meta));

        // Has extension
        if ( reExt.test(candidte) ) {
            matches.add(candidte);
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

}

function resolve( options ) {

    let file = options.file;
    let resolved = _resolve(options);
    let existing = [];

    if (resolved.length && isExternal(resolved[0])) {
        return file;
    }

    resolved.forEach((candidate) => {
        if (fs.existsSync(candidate)) {
            existing.push(candidate);
        }
    });

    return existing[0] || file;
}


module.exports.resolve = resolve;
module.exports._resolve = _resolve;
