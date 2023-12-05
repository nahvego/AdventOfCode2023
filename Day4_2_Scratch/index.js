const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

let sum = 0;


const copiesMap = [];
for (let i = 0; i < lines.length; i++) copiesMap.push(1);

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const [ cardDesc, numbers ] = line.split(':');
    const [ winningStr, ownStr ] = numbers.split('|');
    const winningNumbers = winningStr.split(' ').map(s => s.trim()).filter(s => s.length > 0);
    const ownNumbers = ownStr.split(' ').map(s => s.trim()).filter(s => s.length > 0);

    let winners = 0;

    for (const number of ownNumbers) {
        if (winningNumbers.includes(number)) winners += 1;
    }

    // For each winner add copiesMap[i] to  the next
    for (let j = i + 1; j <= i + winners; j++) {
        copiesMap[j] += copiesMap[i];
    }

    sum += copiesMap[i];
}

console.log(sum);