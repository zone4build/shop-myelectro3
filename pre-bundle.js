const Module = require('module');
const path = require('path');
const originalRequire = Module.prototype.require;

const localNodeModules = path.resolve(__dirname, 'node_modules');

Module.prototype.require = function (id) {
    // If we are looking for react, react-dom, or next-i18next, 
    // try to force the local version in ui/shop/node_modules.
    if (id === 'react' || id === 'react-dom' || id === 'next' || id === 'next-i18next' || id.startsWith('react/') || id.startsWith('react-dom/') || id.startsWith('next/')) {
        try {
            // We resolve the package from the local node_modules
            const resolvedPath = require.resolve(id, { paths: [localNodeModules] });
            return originalRequire.call(this, resolvedPath);
        } catch (e) {
            // Fallback to standard resolution if not found locally
            return originalRequire.call(this, id);
        }
    }
    return originalRequire.call(this, id);
};
