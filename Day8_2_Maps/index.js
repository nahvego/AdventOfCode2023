const fs = require('fs');
const path = require('path');
const { lcmMulti } = require('../utils');

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

console.log(`${steps.length} total steps. ${Object.keys(nodes).length} total nodes`);

// For each 'A' node calculate loop to Z
let aNodes = Object.keys(nodes).filter(n => n.charAt(2) === 'A');

let needs = [];

for (let aNode of aNodes) {
    let step = 1;
    let totalSteps = 1;
    let currentNode = steps[0] === 'L' ? nodes[aNode].left : nodes[aNode].right;
    let firstZ = -1;
    let lastZ = -1;
    let loop = 0;
    let lastZLoop = -1;
    while (currentNode !== aNode) {
        currentNode = steps[step] === 'L' ? nodes[currentNode].left : nodes[currentNode].right;
        totalSteps++;
        step++;
        if (step >= steps.length) {
            loop++;
            step = 0;
        }
        
        if (currentNode.charAt(2) === 'Z') {
            //console.log(`${aNode} reaches ${currentNode} in ${totalSteps} (after ${totalSteps-lastZ} steps)`);
            if (firstZ < 0) {
                firstZ = totalSteps;
                lastZLoop = loop;
                lastZ = totalSteps;
            } else {
                if (lastZLoop !== loop) {
                    console.log(`${aNode} reaches ${currentNode} after ${firstZ}+N${totalSteps-lastZ} steps`);
                    needs.push(totalSteps-lastZ);
                    break;
                } else {
                    lastZloop = loop;
                    lastZ = totalSteps;
                }
            }
        }
    }
}

console.log(needs);

/**
 * From here we know that the number of steps must satisfy all the requirements
 * S = n      * 18157
 * S = n'     * 14363
 * S = n''    * 16531
 * S = n'''   * 12737
 * S = n''''  * 19783
 * S = n''''' * 19241
 * We must then just calculate the lcm of those numbers
 */
console.log(`Steps: ${lcmMulti(...needs)}`);