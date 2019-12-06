const fs = require('fs');
const _path = require('path');
const babelParser = require('@babel/parser');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;

const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    let ast = babelParser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration(path) {
            const node = path.node;
            const dirname = _path.dirname(filename);
            const newFile = './' + _path.join(dirname, node.source.value);
            dependencies[node.source.value] = newFile;
        }
    });
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    });
    return {
        filename,
        dependencies,
        code
    }
}

const moduleInfo = moduleAnalyser('./src/index.js');
console.log(moduleInfo);
