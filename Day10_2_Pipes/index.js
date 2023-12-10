const fs = require('fs');
const path = require('path');
const { setCharAt } = require('../utils');
const {expand, replaceStart} = require('./expand');

const INPUT_FILE = process.argv[2] || 'input.txt';

const CONNECTIONS = {
    '|': { top: 1, bottom: 1, },
    '-': { left: 1, right: 1, },
    'L': { top: 1, right: 1, },
    'J': { top: 1, left: 1, },
    '7': { left: 1, bottom: 1, },
    'F': { right: 1, bottom: 1 },
    '.': {},
    'S': { top: 1, left: 1, bottom: 1, right: 1 },
    '#': {},

    'O': {},
    'I': {},
}

function printMap(lines) {
    for (let y = 0; y < lines.length; y++) {
        console.log(lines[y]);
    }
}

function getWays(map, x, y, ignore) {
    const { bottom, top, left, right } = CONNECTIONS[map[y][x]];
    const ways = [];
    if (ignore !== 'top'    && top    && y !== 0                   && CONNECTIONS[map[y - 1][x]].bottom) ways.push({ x,        y: y - 1, from: 'bottom' });
    if (ignore !== 'bottom' && bottom && y !== (map.length - 1)    && CONNECTIONS[map[y + 1][x]].top)    ways.push({ x,        y: y + 1, from: 'top'    });
    if (ignore !== 'left'   && left   && x !== 0                   && CONNECTIONS[map[y][x - 1]].right)  ways.push({ x: x - 1, y,        from: 'right'  });
    if (ignore !== 'right'  && right  && x !== (map[y].length - 1) && CONNECTIONS[map[y][x + 1]].left)   ways.push({ x: x + 1, y,        from: 'left'   });
    return ways;
}

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

// Find start coordinates
let start;
for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] === 'S') {
            start = {x, y};
            break;
        }
    }
}

console.info(`Start at ${start.x},${start.y}`);

// Find main loop
// 1. Remove invalid pipes
for (let y = 0; y < lines.length; y++) {break;
    for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] === 'S') continue;
        if (lines[y][x] === '.') continue;
        const { top, bottom, left, right } = CONNECTIONS[lines[y][x]];

        if (top) {
            if (y === 0 || !CONNECTIONS[lines[y - 1][x]].bottom) {
                lines[y] = setCharAt(lines[y], x, '#');
                continue;
            }
        }
        if (bottom) {
            if (y === (lines.length - 1) || !CONNECTIONS[lines[y + 1][x]].top) {
                lines[y] = setCharAt(lines[y], x, '#');
                continue;
            }
        }
        if (left) {
            if (x === 0 || !CONNECTIONS[lines[y][x - 1]].right) {
                lines[y] = setCharAt(lines[y], x, '#');
                continue;
            }
        }
        if (right) {
            if (x === (lines[y].length - 1) || !CONNECTIONS[lines[y][x + 1]].left) {
                lines[y] = setCharAt(lines[y], x, '#');
                continue;
            }
        }
    }
}

// printMap(lines);

const startWays = getWays(lines, start.x, start.y);
if (startWays.length !== 2) {
    console.error(`Start multiple ways?`, startWays);
    process.exit(-1);
}

const loop = [start, startWays[0]];

for (;;) {
    const last = loop.at(-1);
    const next = getWays(lines, last.x, last.y, last.from);
    if (next.length > 1) {
        console.error(`From ${last.x},${last.y} error:`, next);
        process.exit(-2);
    }
    if (next[0].x === start.x && next[0].y === start.y) break;
    //console.log(`From ${last.x},${last.y} ignoring ${last.from} next is ${next[0].x},${next[0].y}`);
    loop.push(next[0]);
}

replaceStart(lines, start, startWays);


// Every tile not in the loop is to be replaced with '#'
// as to signify that it's ENCLOSED!
for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
        if (['.','#'].includes(lines[y][x])) continue;
        if (loop.find(l => l.x === x && l.y === y)) continue;
        lines[y] = setCharAt(lines[y], x, '#');
    }
}

function spreadFreedom(map, x, y, firstCall = true) {
    if (!['.', ',','#','$'].includes(map[y][x])) return [];

    if (['#', '$'].includes(map[y][x])) {
        // Special mark
        map[y] = setCharAt(map[y], x, 'T');
    } else {
        map[y] = setCharAt(map[y], x, 'O');
    }

    // x, y is a free tile! each adjacent ground tile is free too; and we spread from there
    const nextSpreads = [];
    if (y > 0) {
        if (['.', ',','#','$'].includes(map[y - 1][x])) {
            nextSpreads.push({ x, y: y - 1 });
        }
    } 
    if (y < (map.length - 1)) {
        if (['.', ',','#','$'].includes(map[y + 1][x])) {
            nextSpreads.push({ x, y: y + 1 });
        }
    }
    if (x > 0) {
        if (['.', ',','#','$'].includes(map[y][x - 1])) {
            nextSpreads.push({ x: x - 1, y });
        }
    }
    if (x < (map[y].length - 1)) {
        if (['.', ',','#','$'].includes(map[y][x + 1])) {
            nextSpreads.push({ x: x + 1, y });
        }
    }
    if (!firstCall) return nextSpreads;

    // First call must process all the spreads
    while (nextSpreads.length > 0) {
        const coords = nextSpreads.shift();
        const spreaded = spreadFreedom(map, coords.x, coords.y, false);
        nextSpreads.push(...spreaded);
    }
}

function setFree(map) {
    // Get outer ground that is free
    const freeGround = [];
    for (let x = 0; x < map[0].length; x++) {
        if ([',','.'].includes(map[0][x])) {
            freeGround.push({x,y: 0});
        }
    }
    for (let x = 0; x < map[map.length - 1].length; x++) {
        if ([',','.'].includes(map[map.length - 1][x])) {
            freeGround.push({x,y: map.length - 1});
        }
    }
    for (let y = 1; y < (map.length - 1); y++) {
        if ([',','.'].includes(map[y][0])) {
            freeGround.push({x: 0,y});
        }
        if ([',','.'].includes(map[y][map[y].length - 1])) {
            freeGround.push({x: map[y].length - 1,y});
        }
    }

    for (const { x, y } of freeGround) {
        spreadFreedom(map, x, y);
    }

    // Every ground left is not free

    let surroundedTiles = 0;
    let surroundedGround = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '.') {
                map[y] = setCharAt(map[y], x, 'I');
                surroundedGround++;
            } else if (map[y][x] === ',') {
                map[y] = setCharAt(map[y], x, 'I');
            } else if (map[y][x] === '#') {
                surroundedTiles++;
            }
        }
    }

    console.info(surroundedTiles);
    console.info(surroundedGround);
    console.info(surroundedGround + surroundedTiles);
}

const expandedMap = expand(lines);

setFree(expandedMap);