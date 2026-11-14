import {
    DOOR_SEATS,
    LIT_ROW,
    PASSENGER_IDS,
    SEAT_COUNT,
    SEAT_INDEXES,
    SEATS_PER_ROW,
    WISH_CODES,
} from '@/core/constants';

/** @typedef {import('@/core/types/seating').Seats} Seats */
/** @typedef {import('@/core/types/seating').Wishes} Wishes */
/** @typedef {import('@/core/types/seating').WishCode} WishCode */
/** @typedef {import('@/core/types/seating').PassengerId} PassengerId */
/** @typedef {import('@/core/types/seating').Level} Level */

const MIN_SAD_PASSENGERS = 3;
const SHUFFLE_ATTEMPTS = 400;

/**
 * @param {number} seat
 * @returns {number}
 */
export function getSeatRow(seat) {
    return Math.floor(seat / SEATS_PER_ROW);
}

/**
 * @param {number} seat
 * @returns {number[]}
 */
export function getAdjacentSeats(seat) {
    return [seat - 1, seat + 1].filter(
        (neighbour) => neighbour >= 0 && neighbour < SEAT_COUNT && getSeatRow(neighbour) === getSeatRow(seat),
    );
}

/**
 * @param {WishCode} wishCode
 * @param {number} seat
 * @param {Seats} seats
 * @returns {boolean}
 */
export function isWishMet(wishCode, seat, seats) {
    const neighbours = getAdjacentSeats(seat).map((neighbour) => seats[neighbour]);

    if (wishCode === WISH_CODES.light) {
        return getSeatRow(seat) === LIT_ROW;
    }

    if (wishCode === WISH_CODES.door) {
        return DOOR_SEATS.includes(seat);
    }

    if (wishCode === WISH_CODES.space) {
        return neighbours.includes(null);
    }

    if (wishCode === WISH_CODES.nearRimma) {
        return neighbours.includes(PASSENGER_IDS.rimma);
    }

    if (wishCode === WISH_CODES.farAnya) {
        return !neighbours.includes(PASSENGER_IDS.anya);
    }

    return true;
}

/**
 * @param {PassengerId} passengerId
 * @param {Seats} seats
 * @param {Wishes} wishes
 * @returns {WishCode | null}
 */
export function getUnmetWish(passengerId, seats, wishes) {
    const seat = seats.indexOf(passengerId);
    const passengerWishes = wishes[passengerId] ?? [];

    return passengerWishes.find((wishCode) => !isWishMet(wishCode, seat, seats)) ?? null;
}

/**
 * @param {Seats} seats
 * @param {Wishes} wishes
 * @returns {PassengerId[]}
 */
export function getSadPassengers(seats, wishes) {
    return Object.keys(wishes).filter((passengerId) => getUnmetWish(passengerId, seats, wishes) !== null);
}

/**
 * @param {Seats} seats
 * @param {Wishes} wishes
 * @returns {boolean}
 */
export function isEveryoneGlad(seats, wishes) {
    return getSadPassengers(seats, wishes).length === 0;
}

/**
 * @param {Seats} seats
 * @param {PassengerId} passengerId
 * @param {number} targetSeat
 * @returns {Seats}
 */
export function swapSeats(seats, passengerId, targetSeat) {
    const currentSeat = seats.indexOf(passengerId);

    return seats.map((occupant, seat) => {
        if (seat === targetSeat) {
            return passengerId;
        }

        if (seat === currentSeat) {
            return seats[targetSeat];
        }

        return occupant;
    });
}

/**
 * @param {PassengerId} passengerId
 * @param {Seats} seats
 * @param {Wishes} wishes
 * @returns {number[]}
 */
export function getWelcomeSeats(passengerId, seats, wishes) {
    const currentSeat = seats.indexOf(passengerId);

    return SEAT_INDEXES.filter(
        (seat) =>
            seat !== currentSeat && getUnmetWish(passengerId, swapSeats(seats, passengerId, seat), wishes) === null,
    );
}

/**
 * @param {Seats} seats
 * @param {() => number} random
 * @returns {Seats}
 */
function shuffleSeats(seats, random) {
    return seats
        .map((occupant) => ({occupant, order: random()}))
        .sort((first, second) => first.order - second.order)
        .map((entry) => entry.occupant);
}

/**
 * @param {Level} level
 * @param {() => number} [random]
 * @returns {Level}
 */
export function createShuffledLevel(level, random = Math.random) {
    const attempts = Array.from({length: SHUFFLE_ATTEMPTS}, () => shuffleSeats(level.start, random));
    const start = attempts.find((seats) => getSadPassengers(seats, level.wishes).length >= MIN_SAD_PASSENGERS);

    return start ? {wishes: level.wishes, start} : level;
}
