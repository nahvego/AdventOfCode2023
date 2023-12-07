// FIRST SOLUTION (BRUTE FORCE) 51399228

const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n').map(l => l.substring(9));
const times = lines[0].split(' ').filter(l => l.length > 0).map(l => +l.trim());
const distances = lines[1].split(' ').filter(l => l.length > 0).map(l => +l.trim());

let totalResult = 1;
for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    console.log(`Race ${i}: ${String(distance).padStart(5, ' ')}mm in ${String(time).padStart(4, ' ')}ms`);

    let localResult = 0;

    for (let v = 0; v < time; v++) {
        const totalDistance = v * (time - v);
        if (totalDistance > distance) {
            console.log(`  > Hold for ${String(v).padStart(4, ' ')}ms to run ${String(totalDistance).padStart(5, ' ')}mm`);
            localResult += 1;
        }
    }
    totalResult *= localResult;
}

console.log(totalResult);