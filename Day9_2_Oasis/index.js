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

    const previousElem = rows.map(r => r.at(0)).reverse().reduce((a, v) => v - a, 0);
    sum += previousElem;

    // Edit rows in place with new result
    const cloneRows = rows.map(r => r.map(n => n));
    cloneRows[cloneRows.length - 1].splice(0, 0, 0)
    for (let r = cloneRows.length - 2; r >= 0; r--) {
        cloneRows[r].splice(0, 0, cloneRows[r][0] - cloneRows[r+1][0]);
    }

    // console.log(`\n\n\nRows for (${history.map(n => String(n).padStart(4, ' ')).join(' ')})`);
    // const pad = 10;
    // for (let r = 0; r < cloneRows.length; r++) {
    //     console.log(' '.repeat((pad / 2) * r) + cloneRows[r].map(n => String(n).padEnd(pad, ' ')).join(' '));
    // }

    console.log(`Previous elem for history ${String(i + 1).padEnd(3, ' ')} (${history.map(n => String(n).padStart(8, ' ')).join(' ')}) is ${previousElem < 0 ? '-' : ' '}${String(Math.abs(previousElem)).padStart(2, ' ')}`);
}

console.log(sum);