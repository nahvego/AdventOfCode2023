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

// JOKER has now the lowest value
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
    'J': 0,
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
    let jokers = 0;
    for (let i = 0; i < 5; i++) {
        // If card is a joker, we add it as a copy of everything (but jokers)
        if (hand[i] === 'J') {
            jokers++;
            for (const card of Object.keys(VALUE_MAP)) {
                if (card === 'J') continue;
                cards[card] ??= 0;
                cards[card]++;
            }
        } else {
            cards[hand[i]] ??= 0;
            cards[hand[i]]++;
        }

        // Score is not changed
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

        // Discard the card that has the trips to avoid errors
        // Then search for a pair without jokers
        const cardsParse = Object.values(cards);
        const tripIdx = cardsParse.findIndex(c => c === 3);
        cardsParse.splice(tripIdx, 1);

        const hasAPair = cardsParse.find(c => (c - jokers) === 2);
        if (hasAPair) {
            ret.game = GameEnum.FULL_HOUSE;
        } else {
            ret.game = GameEnum.TRIPS;
        }
    } else { // pair or two pairs
        // IF we have jokers, this HAS to be a single pair
        // -> If we have a card + 2+ jokers this becomes trips/full/poker/repoker
        // -> If we have 1 joker then it's a pair and it's used
        // -> If we have 0 jokers then logic from part 1 applies
        if (jokers > 0) {
            ret.game = GameEnum.ONE_PAIR;
        } else {
            const pairCount = Object.values(cards).reduce((acc, v) => v === 2 ? acc + 1 : acc, 0);
            if (pairCount === 1) {
                ret.game = GameEnum.ONE_PAIR;
            } else {
                ret.game = GameEnum.TWO_PAIR;
            }
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