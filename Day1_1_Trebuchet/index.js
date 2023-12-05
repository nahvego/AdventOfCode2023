const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

let sum = 0;

const zeroCode = '0'.charCodeAt(0);
const nineCode = '9'.charCodeAt(0);

for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
        if (line.charCodeAt(i) >= zeroCode && line.charCodeAt(i) <= nineCode) {
            sum += 10 * (+line[i]);
            break;
        }
    }
    
    for (let i = line.length; i >= 0; i--) {
        if (line.charCodeAt(i) >= zeroCode && line.charCodeAt(i) <= nineCode) {
            sum += +line[i];
            break;
        }
    }
}

console.log(sum);