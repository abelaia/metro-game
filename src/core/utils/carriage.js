import {SEAT_INDEXES, SEATS_PER_ROW} from '@/core/constants';
import {CARRIAGE} from '@/core/data/carriage';

import {getSeatRow} from './seating';

const PERCENT = 100;

/**
 * @param {number} seat
 * @returns {{x: number, y: number}} сдвиг фигуры в процентах от её размера
 */
export function getPieceOffset(seat) {
    const center = CARRIAGE.seatCenters[seat % SEATS_PER_ROW];
    const top = CARRIAGE.pieceTops[getSeatRow(seat)];

    return {
        x: ((center - CARRIAGE.pieceSize / 2) / CARRIAGE.pieceSize) * PERCENT,
        y: (top / CARRIAGE.pieceSize) * PERCENT,
    };
}

/**
 * @param {number} seat
 * @returns {{left: number, top: number}} положение места в процентах от вагона
 */
export function getSeatBox(seat) {
    const center = CARRIAGE.seatCenters[seat % SEATS_PER_ROW];

    return {
        left: ((center - CARRIAGE.seatWidth / 2) / CARRIAGE.width) * PERCENT,
        top: (CARRIAGE.seatTops[getSeatRow(seat)] / CARRIAGE.height) * PERCENT,
    };
}

/**
 * @param {{x: number, y: number}} point координаты указателя в окне
 * @param {{left: number, top: number, width: number, height: number}} rect рамка вагона
 * @returns {number | null}
 */
export function getNearestSeat(point, rect) {
    const reach = rect.width * CARRIAGE.grabRadiusShare;
    const distances = SEAT_INDEXES.map((seat) => {
        const centerX = rect.left + (CARRIAGE.seatCenters[seat % SEATS_PER_ROW] / CARRIAGE.width) * rect.width;
        const centerY =
            rect.top +
            ((CARRIAGE.pieceTops[getSeatRow(seat)] + CARRIAGE.pieceBodyOffset) / CARRIAGE.height) * rect.height;

        return {seat, distance: Math.hypot(point.x - centerX, point.y - centerY)};
    });
    const nearest = distances.reduce((best, entry) => (entry.distance < best.distance ? entry : best));

    return nearest.distance < reach ? nearest.seat : null;
}
