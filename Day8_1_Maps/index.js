const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const steps = lines[0].split('');

const nodes = {};

for (let i = 2; i < lines.length; i++) {
    const [node, options] = lines[i].split(' = ');
    nodes[node] = {
        left : options.substring(1, 4),
        right: options.substring(6, 9),
    };
}

let totalSteps = 0;
let step = 0;
let node = 'AAA';
while (node !== 'ZZZ') {
    node = steps[step] === 'L' ? nodes[node].left : nodes[node].right;
    totalSteps++;
    step++;
    if (step >= steps.length) step = 0;
}

console.log(totalSteps);