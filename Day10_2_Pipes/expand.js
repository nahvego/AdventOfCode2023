const fs = require('fs');
const path = require('path');
const { setCharAt } = require('../utils');

function printMap(lines) {
    if (require.main !== module) return;
    for (let y = 0; y < lines.length; y++) {
        console.log(lines[y]);
    }
    console.log('---------------------------');
}

function expand(map) {
    let totalDots = 0;
    let totalPounds = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '.') totalDots++;
            if (map[y][x] === '#') totalPounds++;
        }
    }

    const horizontalMap = [];
    // expand map in sets of 2
    for (let y = 0; y < map.length; y++) {
        let lineString = '';
        // Extend horizontally
        for (let x = 1; x < map[y].length; x++) {
            let newStr;
            const checkStr = `${map[y][x-1]}${map[y][x]}`;
            switch (checkStr) {
                case '##': newStr = '#$#'; break;
                default:   newStr = checkStr.charAt(0) + ',' + checkStr.charAt(1); break;
                case '--': newStr = '---'; break;
                case 'L-': newStr = 'L--'; break;
                case '-J': newStr = '--J'; break;
                case 'F-': newStr = 'F--'; break;
                case '-7': newStr = '--7'; break;
                case 'LJ': newStr = 'LLJ'; break;
                case 'L7': newStr = 'LL7'; break;
                case 'FJ': newStr = 'FFJ'; break;
                case 'F7': newStr = 'FF7'; break;
            }
            // Make sure the dots are only counted once
            // Every dot is counted twice except the first one
            // Hence this adjustment
            if (x !== 1 && newStr.charAt(0) === '.') newStr = ',' + newStr.substring(1);
            if (x !== 1 && newStr.charAt(0) === '#') newStr = '$' + newStr.substring(1);
            lineString += newStr;
        }
        horizontalMap.push(lineString);
    }

    let newDotsH = 0;
    let newPoundsH = 0;
    for (let y = 0; y < horizontalMap.length; y++) {
        for (let x = 0; x < horizontalMap[y].length; x++) {
            if (horizontalMap[y][x] === '.') newDotsH++;
            if (horizontalMap[y][x] === '#') newPoundsH++;
        }
    }
    
    if (totalDots !== newDotsH) {
        console.error(`Dots mismatchH. Was ${totalDots}; now ${newDotsH}`);
    }
    
    if (totalPounds !== newPoundsH) {
        console.error(`Pounds mismatchH. Was ${totalPounds}; now ${newPoundsH}`);
    }

    printMap(horizontalMap);
    
    const verticalMap = [];
    // expand map in sets of 2
    for (let x = 0; x < horizontalMap[0].length; x++) {
        let lineString = '';
        // Extend vertically
        for (let y = 1; y < horizontalMap.length; y++) {
            let newStr;
            const checkStr = `${horizontalMap[y-1][x]}${horizontalMap[y][x]}`;
            switch (checkStr) {
                case '##': newStr = '#$#'; break;
                default:  newStr = checkStr.charAt(0) + ',' + checkStr.charAt(1); break;
                case '||': newStr = '|||'; break;
                case 'F|': newStr = 'F||'; break;
                case '7|': newStr = '7||'; break;
                case '|L': newStr = '||L'; break;
                case '|J': newStr = '||J'; break;
                case 'FL': newStr = 'FFL'; break;
                case 'FJ': newStr = 'FFJ'; break;
                case '7L': newStr = '77L'; break;
                case '7J': newStr = '77J'; break;
            }
            // See horizontal
            if (y !== 1 && newStr.charAt(0) === '.') newStr = ',' + newStr.substring(1);
            if (y !== 1 && newStr.charAt(0) === '#') newStr = '$' + newStr.substring(1);
            lineString += newStr;
        }
        verticalMap.push(lineString);
    }

    const newMap = ' '.repeat(verticalMap[0].length).split('').map(a => ' '.repeat(verticalMap.length));
    // VerticalMap is rotated 90deg
    for (let x = 0; x < verticalMap.length; x++) {
        for (let y = 0; y < verticalMap[x].length; y++) {
            newMap[y] = setCharAt(newMap[y], x, verticalMap[x][y]);
        }
    }

    let newDots = 0;
    let newPounds = 0;
    for (let y = 0; y < newMap.length; y++) {
        for (let x = 0; x < newMap[y].length; x++) {
            if (newMap[y][x] === '.') newDots++;
            if (newMap[y][x] === '#') newPounds++;
        }
    }
    
    if (totalDots !== newDots) {
        console.error(`Dots mismatch. Was ${totalDots}; now ${newDots}`);
    }
    
    if (totalPounds !== newPounds) {
        console.error(`Pounds mismatch. Was ${totalPounds}; now ${newPounds}`);
    }

    return newMap;
}

function replaceStart(map, start, startWays) {
    let startTile;
    const startStr = startWays.map(s => s.from).sort().join('-');
    switch (startStr) {
        case 'left-top':
            startTile = 'F';
            break;
        case 'bottom-left':
            startTile = 'L';
            break;
        case 'right-top':
            startTile = '7';
            break;
        case 'bottom-right':
            startTile = 'J';
            break;
        case 'left-right':
            startTile = '-';
            break;
        case 'bottom-top':
            startTile = '|';
            break;
    }
    if (!startTile) throw new Error(`StartTile ${startStr}`);
    map[start.y] = setCharAt(map[start.y], start.x, startTile);
}

module.exports.expand = expand;
module.exports.replaceStart = replaceStart;

if (require.main === module) {
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
    for (let y = 0; y < lines.length; y++) {
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
    
    const startWays = getWays(lines, start.x, start.y);
    if (startWays.length !== 2) {
        console.error(`Start multiple ways?`, startWays);
        process.exit(-1);
    }
    
    replaceStart(lines, start, startWays);
    
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

    printMap(lines);
    
    const newMap = expand(lines);
    printMap(newMap);
}