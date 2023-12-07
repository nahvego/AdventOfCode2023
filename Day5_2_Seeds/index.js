// FIRST SOLUTION (BRUTE FORCE) 51399228

const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const seedRanges = lines[0].split(' ').slice(1).map(s => +s);

function travelSeedRange(maps, seedStart, seedEnd) {
    let ranges = [[seedStart, seedEnd]];
    let stepRanges = [];

    for (let i = 0; i < maps.length; i++) {
        const mapStep = maps[i];

        const nextRanges = [];

        // Calculate all possible ranges via intersections with each map
        for (let r = 0; r < ranges.length; r++) {
            const [ start, end ] = ranges[r];

            // First eliminate maps that are outside of the range
            const validMaps = mapStep.filter(m => m.end >= start && m.start <= end);

            /**
             * Since maps are ordered by start. We will always encounter:
             * [                 original range                            ]
             *[ range starts early]
             *                       [ range within]               [range ends late]
             * [range mapped 1    ][][range mapped3][rangenormal 4][rmappd5]
             * 
             * To calculate we will take a pivot starting at the range and search for a map
             * that starts before or at the pivot and ends after or at the pivot.
             * IF found we create a out-range from the pivot to the end of the map
             * IF not found, we find the next map
             *    IF found, we create an out-range from the pivot to the start of the map and move the pivot
             *    IF not found, we create an out-range from the pivot to the end of the range and end
             */

            // We make sure to map to destination when needed
            let pivot = start;
            while (pivot <= end) {
                const nextMapAtStart = validMaps.find(m => m.start <= pivot && m.end >= pivot);
                if (nextMapAtStart) {
                    if (end > nextMapAtStart.end) {
                        // More to go
                        nextRanges.push([nextMapAtStart.destination + (pivot - nextMapAtStart.start), nextMapAtStart.destination + nextMapAtStart.end - nextMapAtStart.start]);
                        pivot = nextMapAtStart.end + 1;
                        continue;
                    } else {
                        // We done
                        nextRanges.push([nextMapAtStart.destination + (pivot - nextMapAtStart.start), nextMapAtStart.destination + (end - nextMapAtStart.start)]);
                        break;
                    }
                }

                // No map found. Search for the next
                const nextSpacedMap = validMaps.find(m => m.start >= pivot);
                if (nextSpacedMap) {
                    // Map found. Create to ranges. One from pivot to mapstart. Another from  mapstart to whichever end
                    nextRanges.push([pivot, nextSpacedMap.start - 1]);

                    // Since this ranges start at the MAP, no need to do math on range start
                    if (end > nextSpacedMap.end) {
                        // More to go
                        nextRanges.push([nextSpacedMap.destination, nextSpacedMap.destination + nextSpacedMap.end - nextSpacedMap.start]);
                        pivot = nextSpacedMap.end + 1;
                        continue;
                    } else {
                        // We done
                        nextRanges.push([nextSpacedMap.destination, nextSpacedMap.destination + (end - nextSpacedMap.start)]);
                        break;
                    }
                }

                // No more ranges to go. Create a range just for this
                nextRanges.push([pivot, end]);
                break;
            }
        }

        stepRanges.push(nextRanges);
        ranges = nextRanges; // swap ranges for next map step
    }

    return { ranges, stepRanges};
}

// each element is a step
// each step is an array of {start,end,destination}
const maps = [];

const mapLines = lines.flatMap((l, i) => l.includes('map:') ? i : []);

for (const mapLineIndex of mapLines) {
    const currentMap = [];

    let lineIdx = mapLineIndex + 1;
    while (lineIdx < lines.length && lines[lineIdx].length > 0) {
        const [destination, start, step] = lines[lineIdx].split(' ', 3).map(t => +t);
        currentMap.push({ destination, start, end: start + step - 1, });

        lineIdx++;
    }

    currentMap.sort((a, b) => a.start - b.start);

    maps.push(currentMap);
}

const traveller = travelSeedRange.bind(null, maps);

let lowestSeed = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < seedRanges.length; i += 2) {
    const travel = traveller(seedRanges[i], seedRanges[i] + seedRanges[i + 1] - 1);
    const localMin = travel.ranges.sort((a, b) => a[0] - b[0]).at(0)?.at(0) ?? Number.MAX_SAFE_INTEGER;
    if (localMin < lowestSeed) lowestSeed = localMin;
}


console.log(lowestSeed);