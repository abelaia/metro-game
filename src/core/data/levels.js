import {WISH_CODES} from '@/core/constants';

const CALM_WISHES = Object.freeze({
    ficus: Object.freeze([WISH_CODES.light]),
    anya: Object.freeze([WISH_CODES.door]),
    dino: Object.freeze([WISH_CODES.space]),
    rimma: Object.freeze([WISH_CODES.farAnya]),
    cat: Object.freeze([WISH_CODES.nearRimma]),
});

const TIGHT_WISHES = Object.freeze({
    ...CALM_WISHES,
    rimma: Object.freeze([WISH_CODES.door, WISH_CODES.farAnya]),
});

/** @type {ReadonlyArray<import('@/core/types/seating').Level>} */
export const LEVELS = Object.freeze([
    Object.freeze({
        wishes: Object.freeze({ficus: CALM_WISHES.ficus}),
        start: Object.freeze([null, null, null, null, 'ficus', null]),
    }),
    Object.freeze({
        wishes: Object.freeze({ficus: CALM_WISHES.ficus, anya: CALM_WISHES.anya}),
        start: Object.freeze(['anya', null, null, null, null, 'ficus']),
    }),
    Object.freeze({
        wishes: Object.freeze({ficus: CALM_WISHES.ficus, anya: CALM_WISHES.anya, dino: CALM_WISHES.dino}),
        start: Object.freeze([null, null, null, 'ficus', 'anya', 'dino']),
    }),
    Object.freeze({
        wishes: CALM_WISHES,
        start: Object.freeze(['anya', 'cat', 'dino', 'rimma', 'ficus', null]),
    }),
    Object.freeze({
        wishes: TIGHT_WISHES,
        start: Object.freeze(['rimma', 'dino', 'cat', 'ficus', null, 'anya']),
    }),
]);

/** @type {ReadonlyArray<import('@/core/types/seating').Level>} */
export const ENDLESS_LEVELS = Object.freeze([LEVELS[4], LEVELS[3]]);
