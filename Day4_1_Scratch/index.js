const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

let sum = 0;

for (const line of lines) {
    const [ cardDesc, numbers ] = line.split(':');
    const [ winningStr, ownStr ] = numbers.split('|');
    const winningNumbers = winningStr.split(' ').map(s => s.trim()).filter(s => s.length > 0);
    const ownNumbers = ownStr.split(' ').map(s => s.trim()).filter(s => s.length > 0);

    let winners = 0;

    for (const number of ownNumbers) {
        if (winningNumbers.includes(number)) winners += 1;
    }

    if (winners > 0)
        sum += 2**(winners - 1);
}

console.log(sum);