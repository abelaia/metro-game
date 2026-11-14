import {describe, expect, it} from 'vitest';
import {SEAT_COUNT} from '@/core/constants';
import {isEveryoneGlad} from '@/core/utils/seating';

import {ENDLESS_LEVELS, LEVELS} from './levels';
import {PASSENGERS} from './passengers';
import {WISHES} from './wishes';

function getPermutations(items) {
    if (items.length <= 1) {
        return [items];
    }

    return items.flatMap((item, index) =>
        getPermutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]),
    );
}

describe('levels', () => {
    it('в каждой станции шесть мест и нет повторяющихся пассажиров', () => {
        LEVELS.forEach((level) => {
            const seated = level.start.filter((occupant) => occupant !== null);

            expect(level.start).toHaveLength(SEAT_COUNT);
            expect(new Set(seated).size).toBe(seated.length);
            expect([...seated].sort()).toEqual(Object.keys(level.wishes).sort());
        });
    });

    it('пассажиры и желания станций есть в каталогах', () => {
        LEVELS.forEach((level) => {
            Object.entries(level.wishes).forEach(([passengerId, wishCodes]) => {
                expect(PASSENGERS[passengerId]).toBeDefined();
                wishCodes.forEach((wishCode) => expect(WISHES[wishCode]).toBeDefined());
            });
        });
    });

    it('станция не решена в начале', () => {
        LEVELS.forEach((level) => {
            expect(isEveryoneGlad(level.start, level.wishes)).toBe(false);
        });
    });

    it('у каждой станции есть решение', () => {
        LEVELS.forEach((level) => {
            const hasSolution = getPermutations([...level.start]).some((seats) => isEveryoneGlad(seats, level.wishes));

            expect(hasSolution).toBe(true);
        });
    });

    it('бесконечные станции берутся из полных составов', () => {
        ENDLESS_LEVELS.forEach((level) => {
            expect(Object.keys(level.wishes)).toHaveLength(Object.keys(PASSENGERS).length);
        });
    });
});
