// FIRST SOLUTION (BRUTE FORCE) 51399228

const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const seedRanges = lines[0].split(' ').slice(1).map(s => +s);

function travelSeed(maps, seed) {
    let rollingValue = seed;
    let intermediateSteps = [seed];
    for (let i = 0; i < maps.length; i++) {
        const mapStep = maps[i];

        const toApply = mapStep.find(m => rollingValue >= m.origin && rollingValue <= m.origin + m.step);
        // if (!toApply) rollingValue = rollingValue;
        if (toApply) rollingValue = toApply.destination + rollingValue - toApply.origin;
        intermediateSteps.push(rollingValue);
    }
    return {
        value: rollingValue,
        steps: intermediateSteps,
    };
}

function travelSeedRange(maps, seedStart, seedEnd) {
    const ranges = [[seedStart, seedEnd]];
    const nextRanges = [];

    for (let i = 0; i < maps.length; i++) {
        const mapStep = maps[i];

        // Calculate intersections with ranges.
        for (let r = 0; r < ranges.length; r++) {
            const [ start, end ] = ranges[r];
            for (let m = 0; m < mapStep.length; m++) {
                if (m.origin > start && (m.origin + m.step))
            }
        }
    }
}

// each element is a step
// each step is an array of {origin,step,destination}
const maps = [];

const mapLines = lines.flatMap((l, i) => l.includes('map:') ? i : []);

for (const mapLineIndex of mapLines) {
    const currentMap = [];

    let lineIdx = mapLineIndex + 1;
    while (lineIdx < lines.length && lines[lineIdx].length > 0) {
        const [destination, origin, step] = lines[lineIdx].split(' ', 3).map(t => +t);
        currentMap.push({ destination, origin, step, });

        lineIdx++;
    }

    maps.push(currentMap);
}

const traveller = travelSeed.bind(null, maps);

let lowestSeed = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < seedRanges.length; i += 2) {
    for (let seed = seedRanges[i]; seed < seedRanges[i] + seedRanges[i + 1]; seed++) {
        const { value, steps } = traveller(seed);
        if (value < lowestSeed) lowestSeed = value;
        //console.log(`Seed ${String(seed).padStart(10, ' ')} => ${steps.map(s => String(s).padStart(10, ' ')).join(' => ')}`);
    }
    console.log('Pair done');
}


console.log(lowestSeed);