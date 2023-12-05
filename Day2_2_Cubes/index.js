const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

let sum = 0;

for (const _line of lines) {
    // Dirty get all data
    const game = +_line.split(':')[0].substring(5);
    const sets = _line.split(':')[1].split(';').map(s => {
        // can't have default values
        const set = {};
        const out = s.split(',');
        for (const cubeDesc of out) {
            const n = parseInt(cubeDesc); // JS! :D
            if (cubeDesc.includes('red')) set.red = n;
            else if (cubeDesc.includes('green')) set.green = n;
            else if (cubeDesc.includes('blue')) set.blue = n;
            else console.log('Unknown', cubeDesc, out, s, _line);
        }
        return set;
    });

    let minimums = {
        red: 0,
        green: 0,
        blue: 0,
    };

    for (const set of sets) {
        // Values that were not take out of the box in the set are not present
        for (const [color, amount] of Object.entries(set)) {
            if (minimums[color] < amount) minimums[color] = amount;
        }
    }

    sum += Object.values(minimums).reduce((acc, v) => acc * v, 1);
}

console.log(sum);