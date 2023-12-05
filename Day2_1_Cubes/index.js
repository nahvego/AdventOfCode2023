const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const maxCubes = {
    'red': 12,
    'green': 13,
    'blue': 14,
};

let sum = 0;

for (const _line of lines) {
    // Dirty get all data
    const game = +_line.split(':')[0].substring(5);
    const sets = _line.split(':')[1].split(';').map(s => {
        const set = {
            red: 0,
            green: 0,
            blue: 0,
        };
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

    let valid = true;
    
    for (const set of sets) {
        if (!valid) break;
        for (const [color, max] of Object.entries(maxCubes)) {
            if (set[color] > max) {
                valid = false;
                break;
            }
        }
    }

    if (valid) sum += game;
}

console.log(sum);