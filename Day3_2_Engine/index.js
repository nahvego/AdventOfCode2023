const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const NOT_SYMBOLS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let sum = 0;

// I really wish JS had mutable strings sometimes :(
function setCharAt(str, idx, char) {
    return str.substring(0, idx) + char + str.substring(idx + 1);
}

for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    let line = lines[lineNumber];

    // Iterate to find symbols
    // Find only gera this time
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        if (line.charAt(charIdx) !== '*') continue;

        // Find adjacent numbers as they are easy
        // Keep count of how many there are
        let numbers = [];

        // Left
        /**
         * Starting at the left of the symbol, check if it's a number.
         * If a number, calculate the total keeping in mind the position (just for fanciness!)
         * Also make sure to edit the line in place so the number isn't counted multiple times
         */
        if (charIdx > 0 && NUMBERS.includes(line.charAt(charIdx - 1))) {
            const start = charIdx - 1;
            let ptr = start;
            while (ptr >= 0 && NUMBERS.includes(line.charAt(ptr))) {
                ptr--;
            }
            numbers.push(+line.substring(ptr + 1, start + 1));
            for (let i = ptr + 1; i < start; i++) line = setCharAt(line, i, '.');
        }

        // Right
        /**
         * Starting to the right while we have a number we take the starting and end position of the number.
         * Then we parse that substring as a number and substitute it with dots to avoid double-counting.
         * Must first check if we actually have a number adjacent before we start counting.
         */
        if (charIdx < (line.length - 1) && NUMBERS.includes(line.charAt(charIdx + 1))) {
            const start = charIdx + 1;
            let ptr = start;
            while (ptr < line.length && NUMBERS.includes(line.charAt(ptr))) {
                ptr++;
            }
            numbers.push(+line.substring(start, ptr));
            for (let i = start; i <= ptr; i++) line = setCharAt(line, i, '.');
        }


        // Up
        /**
         * Starting at the previous line we take the positions above.
         * There's multiple cases:
         * (1) All three positions share a number and must extend at both sides
         * (2) There's one number at each corner that extend to the sides; but not in the middle
         * (3) There's no numbers
         * (4) Like (2), but just one of the two
         * 
         * Naive approach is to start at the corners and extend and *then* check if we should merge
         */
        if (lineNumber > 0) {
            let previousLine = lines[lineNumber - 1];
            let leftNumber = '';
            let rightNumber = '';
            // left corner
            if (charIdx > 0 && NUMBERS.includes(previousLine.charAt(charIdx - 1))) {
                const start = charIdx - 1;
                let ptr = start;
                while (ptr >= 0 && NUMBERS.includes(previousLine.charAt(ptr))) {
                    ptr--;
                }
                leftNumber = previousLine.substring(ptr + 1, start + 1);
                for (let i = start; i > ptr; i--) previousLine = setCharAt(previousLine, i, '.');
            }

            // right
            if (charIdx < (previousLine.length - 1) && NUMBERS.includes(previousLine.charAt(charIdx + 1))) {
                const start = charIdx + 1;
                let ptr = start;
                while (ptr < previousLine.length && NUMBERS.includes(previousLine.charAt(ptr))) {
                    ptr++;
                }
                rightNumber = previousLine.substring(start, ptr);
                for (let i = start; i <= ptr; i++) previousLine = setCharAt(previousLine, i, '.');
            }

            // Check middle
            if (NUMBERS.includes(previousLine.charAt(charIdx))) {
                // It's all one number!
                const n = parseInt(`${leftNumber}${previousLine.charAt(charIdx)}${rightNumber}`);
                numbers.push(n);
                previousLine[charIdx] = setCharAt(previousLine, charIdx, '.');
            } else {
                // Add numbers on their own, if there's any
                if (leftNumber.length > 0) numbers.push(parseInt(leftNumber));
                if (rightNumber.length > 0) numbers.push(parseInt(rightNumber));
            }
            // finally set the string line
            lines[lineNumber - 1] = previousLine;
        }

        // Down
        // Exactly as before
        if (lineNumber < (lines.length - 1)) {
            let nextLine = lines[lineNumber + 1];
            let leftNumber = '';
            let rightNumber = '';
            // left corner
            if (charIdx > 0 && NUMBERS.includes(nextLine.charAt(charIdx - 1))) {
                const start = charIdx - 1;
                let ptr = start;
                while (ptr >= 0 && NUMBERS.includes(nextLine.charAt(ptr))) {
                    ptr--;
                }
                leftNumber = nextLine.substring(ptr + 1, start + 1);
                for (let i = start; i > ptr; i--) nextLine = setCharAt(nextLine, i, '.');
            }

            // right
            if (charIdx < (nextLine.length - 1) && NUMBERS.includes(nextLine.charAt(charIdx + 1))) {
                const start = charIdx + 1;
                let ptr = start;
                while (ptr < nextLine.length && NUMBERS.includes(nextLine.charAt(ptr))) {
                    ptr++;
                }
                rightNumber = nextLine.substring(start, ptr);
                for (let i = start; i <= ptr; i++) nextLine = setCharAt(nextLine, i, '.');
            }

            // Check middle
            if (NUMBERS.includes(nextLine.charAt(charIdx))) {
                // It's all one number!
                const n = parseInt(`${leftNumber}${nextLine.charAt(charIdx)}${rightNumber}`);
                numbers.push(n);
                nextLine[charIdx] = setCharAt(nextLine, charIdx, '.');
            } else {
                // Add numbers on their own, if there's any
                if (leftNumber.length > 0) numbers.push(parseInt(leftNumber));
                if (rightNumber.length > 0) numbers.push(parseInt(rightNumber));
            }

            // finally set the string line
            lines[lineNumber + 1] = nextLine;
        }

        if (numbers.length === 2) {
            // It's a gear!
            sum += numbers[0] * numbers[1];
        }
    }

    lines[lineNumber] = line;
}

console.log(sum);