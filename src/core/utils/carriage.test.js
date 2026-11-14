import {describe, expect, it} from 'vitest';

import {getNearestSeat, getPieceOffset, getSeatBox} from './carriage';

const RECT = {left: 0, top: 0, width: 360, height: 540};

describe('carriage', () => {
    it('находит место под указателем', () => {
        expect(getNearestSeat({x: 50, y: 191}, RECT)).toBe(0);
        expect(getNearestSeat({x: 218, y: 191}, RECT)).toBe(2);
        expect(getNearestSeat({x: 134, y: 461}, RECT)).toBe(4);
    });

    it('не выбирает место, если указатель далеко от сидений', () => {
        expect(getNearestSeat({x: 350, y: 10}, RECT)).toBeNull();
    });

    it('учитывает положение вагона на странице', () => {
        expect(getNearestSeat({x: 150, y: 291}, {left: 100, top: 100, width: 360, height: 540})).toBe(0);
    });

    it('ставит фигуру нижнего этажа ниже верхнего', () => {
        expect(getPieceOffset(3).y).toBeGreaterThan(getPieceOffset(0).y);
        expect(getPieceOffset(3).x).toBe(getPieceOffset(0).x);
    });

    it('размещает места слева направо', () => {
        expect(getSeatBox(1).left).toBeGreaterThan(getSeatBox(0).left);
        expect(getSeatBox(4).top).toBeGreaterThan(getSeatBox(1).top);
    });
});
