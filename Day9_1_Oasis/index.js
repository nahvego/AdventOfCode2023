const fs = require('fs');
const path = require('path');
const { lcmMulti } = require('../utils');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const histories = lines.map(l => l.split(' ').map(n => +n));

let sum = 0;

for (let i = 0; i < histories.length; i++) {
    const history = histories[i];

    const rows = [history];

    while (rows.at(-1).some(r => r !== 0)) {
        const lastRow = rows.at(-1);
        const newRow = [];
        for (let i = 1; i < lastRow.length; i++) {
            newRow.push(lastRow[i] - lastRow[i - 1]);
        }
        rows.push(newRow);
    }

    const nextElem = rows.map(r => r.at(-1)).reduce((a, v) => a + v, 0);
    sum += nextElem;

    console.log(`Next elem for history ${i + 1} (${history.map(n => String(n).padStart(4, ' ')).join(' ')}) is ${nextElem}`);
}

console.log(sum);