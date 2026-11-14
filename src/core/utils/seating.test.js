import {describe, expect, it} from 'vitest';
import {WISH_CODES} from '@/core/constants';

import {
    createShuffledLevel,
    getAdjacentSeats,
    getSadPassengers,
    getUnmetWish,
    getWelcomeSeats,
    isEveryoneGlad,
    isWishMet,
    swapSeats,
} from './seating';

const WISHES = {
    ficus: [WISH_CODES.light],
    anya: [WISH_CODES.door],
    dino: [WISH_CODES.space],
    rimma: [WISH_CODES.farAnya],
    cat: [WISH_CODES.nearRimma],
};

describe('seating', () => {
    it('считает соседями только места своего этажа', () => {
        expect(getAdjacentSeats(0)).toEqual([1]);
        expect(getAdjacentSeats(1)).toEqual([0, 2]);
        expect(getAdjacentSeats(2)).toEqual([1]);
        expect(getAdjacentSeats(3)).toEqual([4]);
    });

    it('свет есть только на верхнем этаже', () => {
        const seats = [null, null, null, null, null, null];

        expect(isWishMet(WISH_CODES.light, 2, seats)).toBe(true);
        expect(isWishMet(WISH_CODES.light, 3, seats)).toBe(false);
    });

    it('у двери только крайние правые места', () => {
        const seats = [null, null, null, null, null, null];

        expect(isWishMet(WISH_CODES.door, 2, seats)).toBe(true);
        expect(isWishMet(WISH_CODES.door, 5, seats)).toBe(true);
        expect(isWishMet(WISH_CODES.door, 4, seats)).toBe(false);
    });

    it('динозавру нужно свободное место рядом', () => {
        expect(isWishMet(WISH_CODES.space, 1, ['ficus', 'dino', null, null, null, null])).toBe(true);
        expect(isWishMet(WISH_CODES.space, 1, ['ficus', 'dino', 'anya', null, null, null])).toBe(false);
    });

    it('кот доволен рядом с бабушкой, бабушка недовольна рядом с невестой', () => {
        const seats = ['cat', 'rimma', 'anya', null, null, null];

        expect(getUnmetWish('cat', seats, WISHES)).toBeNull();
        expect(getUnmetWish('rimma', seats, WISHES)).toBe(WISH_CODES.farAnya);
    });

    it('меняет пассажиров местами и не трогает исходную расстановку', () => {
        const seats = ['anya', 'cat', null, null, null, null];

        expect(swapSeats(seats, 'anya', 1)).toEqual(['cat', 'anya', null, null, null, null]);
        expect(swapSeats(seats, 'anya', 5)).toEqual([null, 'cat', null, null, null, 'anya']);
        expect(seats).toEqual(['anya', 'cat', null, null, null, null]);
    });

    it('подсвечивает места, где пассажиру будет хорошо, кроме текущего', () => {
        expect(getWelcomeSeats('ficus', [null, null, null, null, 'ficus', null], WISHES)).toEqual([0, 1, 2]);
        expect(getWelcomeSeats('ficus', ['ficus', null, null, null, null, null], WISHES)).toEqual([1, 2]);
    });

    it('видит, что все довольны', () => {
        const seats = ['ficus', 'dino', null, 'rimma', 'cat', 'anya'];

        expect(getSadPassengers(seats, WISHES)).toEqual([]);
        expect(isEveryoneGlad(seats, WISHES)).toBe(true);
    });

    it('перемешивает станцию так, чтобы недовольных было не меньше трёх', () => {
        const level = {wishes: WISHES, start: ['ficus', 'dino', null, 'rimma', 'cat', 'anya']};
        const shuffled = createShuffledLevel(level);

        expect([...shuffled.start].sort()).toEqual([...level.start].sort());
        expect(getSadPassengers(shuffled.start, WISHES).length).toBeGreaterThanOrEqual(3);
    });

    it('возвращает исходную станцию, если перемешать не удалось', () => {
        const level = {wishes: {ficus: [WISH_CODES.light]}, start: [null, null, null, null, 'ficus', null]};

        expect(createShuffledLevel(level, () => 0)).toBe(level);
    });
});
