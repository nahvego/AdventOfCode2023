// FIRST SOLUTION (BRUTE FORCE) 51399228

const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n').map(l => l.substring(9));
const time = +lines[0].replace(/\D/g, '');
const distance = +lines[1].replace(/\D/g, '');

console.log(`Race: ${String(distance).padStart(5, ' ')}mm in ${String(time).padStart(4, ' ')}ms`);

/**
 * The total Distance d' = v(t - v) is a parable.
 * The portion we want is f(v) = {v(t - v) | 0 < v < t } when f(v) > d
 * This is equivalent to:
 * v(t - v) = vt - v2 = -v^2+vt
 * 
 * Assuming d is less than the vertex of the parabola (it should!)
 * there's two cut points between y = d and y = -v^2+vt
 * 
 * d = -v^2 + vt => -v^2 + vt - d = 0 => v = -t +- sqrt(t^2 - 4d) / -2
 */

// Math.floor(thePartInSqrtWhichNameIDontRemember) = the number of ways also :^)
const thePartInSqrtWhichNameIDontRemember = Math.sqrt(time * time - 4 * distance);
if (Number.isNaN(thePartInSqrtWhichNameIDontRemember))
    throw new Error('Sqrt bad!');

console.log(thePartInSqrtWhichNameIDontRemember)
const v1 = (-time + thePartInSqrtWhichNameIDontRemember) / -2;
const v2 = (-time - thePartInSqrtWhichNameIDontRemember) / -2;

const minV = Math.ceil(v1);
const maxV = Math.floor(v2);

console.log(`Hold from ${minV}ms to ${maxV}ms (${maxV - minV + 1} ways)`);