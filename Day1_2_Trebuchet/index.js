const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

let sum = 0;

const values = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

for (const _line of lines) {
    let line = _line;

    /**
     * Numbers can be intertwined.
     * We can  encounter something like 'oneight' and this  should be interpreted  differently depending on the direction we are reading.
     * From the left this should be '1ight' and from the right 'on8'.
     * Fast approach is just to look for every value and order by position
     */

    const first = values.map((v, i) => ({ n: i > 10 ? i - 10 : i, p: line.indexOf(v) })).filter(e => e.p >= 0).sort((a, b) => a.p - b.p);
    const last = values.map((v, i) => ({ n: i > 10 ? i - 10 : i, p: line.lastIndexOf(v) })).filter(e => e.p >= 0).sort((a, b) => b.p - a.p);

    if (first.length > 0) sum += 10 * first[0].n;
    if (last.length > 0) sum += last[0].n;
}

console.log(sum);