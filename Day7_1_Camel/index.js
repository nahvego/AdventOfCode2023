// FIRST SOLUTION (BRUTE FORCE) 51399228

const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), 'utf-8').split('\n');

const GameEnum = Object.freeze({
    HIGH_CARD: 0,
    ONE_PAIR: 1,
    TWO_PAIR: 2,
    TRIPS: 3,
    FULL_HOUSE: 4,
    POKER: 5,
    REPOKER: 6,
});
const GAME_STR = {
    [GameEnum.HIGH_CARD]:  'High card',
    [GameEnum.ONE_PAIR]:   'One pair',
    [GameEnum.TWO_PAIR]:   'Two pair',
    [GameEnum.TRIPS]:      'Three of a kind',
    [GameEnum.FULL_HOUSE]: 'Full house',
    [GameEnum.POKER]:      'Four of a kind',
    [GameEnum.REPOKER]:    'Five of a kind'
}

const VALUE_MAP = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

/**
 * Each hand is an object with:
 * bid: the bid of the hand
 * hand: the cards in the hand for display
 * game: the index in the GAMES array with the play in question
 * score: numerical value to check the value of the hand in case of a tie
 */
const hands = lines.map(l => {
    const [ hand, bid ] = l.split(' ');

    const ret = {};
    ret.bid = bid;
    ret.hand = hand;

    ret.score = 0;

    // Calculate repeated cards with a map
    const cards = {};
    for (let i = 0; i < 5; i++) {
        cards[hand[i]] ??= 0;
        cards[hand[i]]++;

        ret.score += VALUE_MAP[hand[i]] * 10**((5 - i - 1)*2);
    }

    // Find highest 
    const highestNum = Object.values(cards).reduce((acc, v) => v > acc ? v : acc, 0);
    if (highestNum === 1) {
        ret.game = GameEnum.HIGH_CARD;
    } else if (highestNum === 4) { // The ga
        ret.game = GameEnum.POKER;
    } else if (highestNum === 5) {
        ret.game = GameEnum.REPOKER;
    } else if (highestNum === 3) {
        // trips or full house
        const hasAPair = Object.values(cards).find(c => c === 2);
        if (hasAPair) {
            ret.game = GameEnum.FULL_HOUSE;
        } else {
            ret.game = GameEnum.TRIPS;
        }
    } else { // pair or two pairs
        const pairCount = Object.values(cards).reduce((acc, v) => v === 2 ? acc + 1 : acc, 0);
        if (pairCount === 1) {
            ret.game = GameEnum.ONE_PAIR;
        } else {
            ret.game = GameEnum.TWO_PAIR;
        }
    }

    return ret;
});

// Sort hands by game (ascending) type and then score (ascending) (higher rank == better)
hands.sort((h1, h2) => h1.game - h2.game || h1.score - h2.score)

let winnings = 0;
for (let i = hands.length - 1; i >= 0; i--) {
    const hand = hands[i];
    console.info(`Rank ${i + 1}: Hand ${hand.hand} bids ${hand.bid} and has a ${GAME_STR[hand.game]}. WINS ${hand.bid * (i + 1)}`);
    winnings += hand.bid * (i + 1);
}
console.log(winnings);