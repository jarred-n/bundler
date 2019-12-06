const fs = require('fs');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    let ast = babelParser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = [];
    traverse(ast, {
        ImportDeclaration(path) {
            const node = path.node;
            const dirname = path.dirname(filename);
            console.log(dirname);
            dependencies.push(node.source.value)
        }
    })
    console.log(ast.program.body);
}

moduleAnalyser('./src/index.js');
