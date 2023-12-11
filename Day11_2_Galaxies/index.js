const fs = require('fs');
const path = require('path');
const { setCharAt } = require('../utils');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const FACTOR = 1_000_000;

function printMap(map) {
    console.log('='.repeat(map[0].length));
    for (let y = 0; y < map.length; y++) {
        console.log(map[y]);
    }
    console.log('='.repeat(map[0].length));
}

// Expands a galaxy!
// Tiles with x mark the ultra-expanded space
function expand(map) {
    const rows = [];
    const duplicateCols = [];
    for (let r = 0; r < map.length; r++) {
        // Dupe rows
        if (map[r].split('').every(c => c === '.')) {
            rows.push('x'.repeat(map[r].length));
        }
        rows.push(map[r]);
    }

    // Dupe columns
    for (let c = 0; c < map[0].length; c++) {
        let shouldDupe = true;
        for (let r = 0; r < map.length; r++) {
            if (map[r][c] !== '.') {
                shouldDupe = false;
                break;
            }
        }
        if (shouldDupe) duplicateCols.push(c);
    }

    return rows.map(row => {
        let tempStr = '';
        let pivot = 0;
        for (const col of duplicateCols) {
            tempStr += row.substring(pivot, col) + 'x';
            pivot = col + 1;
        }
        tempStr += row.substring(pivot);
        return tempStr;
    });
}

function searchGalaxies(map) {
    const galaxies = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '#') galaxies.push({x, y});
        }
    }
    return galaxies;
}

// This has some fancy name
function distance(map, point1, point2) {
    let distance = 0;

    // Sum column and row
    let minX = Math.min(point1.x, point2.x);
    let maxX = Math.max(point1.x, point2.x);
    let minY = Math.min(point1.y, point2.y);
    let maxY = Math.max(point1.y, point2.y);

    for (let x = minX + 1; x <= maxX; x++) {
        if (map[minY][x] === 'x')
            distance += FACTOR;
        else
            distance += 1;
    }

    // Start at minY+1 to avoid double-counting the corner
    for (let y = minY + 1; y <= maxY; y++) {
        if (map[y][maxX] === 'x')
            distance += FACTOR - 1;
        else
            distance += 1;
    }

    return distance;
}

const expanded = expand(lines);

console.log('Map:');
printMap(lines);

console.log('Expanded:');
printMap(expanded);

const galaxies = searchGalaxies(expanded);

let sum = 0;

for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        // console.log(`${galaxies[i].x},${galaxies[i].y} ==> ${galaxies[j].x},${galaxies[j].y}: ${distance(expanded, galaxies[i], galaxies[j])}`)
        sum += distance(expanded, galaxies[i], galaxies[j]);
    }
}

console.info(sum);