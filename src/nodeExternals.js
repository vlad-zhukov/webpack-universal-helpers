import fs from 'fs';
import path from 'path';

const scopedModuleRegex = /@[a-z0-9][\w-.]+\/[a-z0-9][\w-.]+([a-z0-9./]+)?/i;
const atPrefix = /^@/;

const contains = (array, value) => array && array.indexOf(value) !== -1;

function matchesPattern(string, pattern) {
    if (!pattern) return false;
    if (typeof pattern === 'function') return pattern(string);
    if (Array.isArray(pattern)) return contains(pattern, string);
    if (pattern instanceof RegExp) return pattern.test(string);
    return pattern === string;
}

function getModuleListFromPackageJson(pathToPackageJson, packageJsonSections) {
    if (!pathToPackageJson) {
        return [];
    }

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require(pathToPackageJson);

    const modules = {};
    packageJsonSections.forEach((section) => {
        Object.keys(pkg[section] || {}).forEach((dep) => {
            modules[dep] = true;
        });
    });

    return Object.keys(modules);
}

function getModuleListFromNodeModules(pathToNodeModules, excludeNodeModulesDirs) {
    if (!pathToNodeModules) {
        return [];
    }

    const modules = {};
    fs.readdirSync(pathToNodeModules).forEach((dep) => {
        if (dep.startsWith('.')) {
            return;
        }

        if (atPrefix.test(dep)) {
            fs.readdirSync(path.join(pathToNodeModules, dep)).forEach((scopedMod) => {
                modules[`${dep}/${scopedMod}`] = true;
            });
        }
        else {
            modules[dep] = true;
        }
    });

    return Object.keys(modules).filter(m => !matchesPattern(m, excludeNodeModulesDirs));
}

function getModuleName(request, includeAbsolutePaths) {
    let req = request;
    const delimiter = '/';

    if (includeAbsolutePaths) {
        req = req.replace(/^.*?\/node_modules\//, '');
    }
    // check if scoped module
    if (scopedModuleRegex.test(req)) {
        return req.split(delimiter, 2).join(delimiter);
    }
    return req.split(delimiter)[0];
}

export default function nodeExternals({
    pathToPackageJson,
    packageJsonSections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'],
    pathToNodeModules,
    excludeNodeModulesDirs,
    whitelist,
    importType = 'commonjs',
    includeAbsolutePaths = true,
}) {
    const modulesFromPackageJson = getModuleListFromPackageJson(pathToPackageJson, packageJsonSections);
    const modulesFromNodeModules = getModuleListFromNodeModules(pathToNodeModules, excludeNodeModulesDirs);

    // create the node modules list
    const moduleList = [...modulesFromPackageJson, ...modulesFromNodeModules];

    return (context, request, callback) => {
        const moduleName = getModuleName(request, includeAbsolutePaths);
        if (contains(moduleList, moduleName) || matchesPattern(request, whitelist)) {
            // mark this module as external
            // https://webpack.github.io/docs/configuration.html#externals
            return callback(null, `${importType} ${request}`);
        }
        return callback();
    };
}
