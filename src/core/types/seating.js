/**
 * @typedef {'dino' | 'rimma' | 'anya' | 'cat' | 'ficus'} PassengerId
 */

/**
 * @typedef {'light' | 'door' | 'space' | 'nearRimma' | 'farAnya'} WishCode
 */

/**
 * Расстановка: индекс — номер места (0–2 верхний этаж, 3–5 нижний), значение — пассажир или null.
 * @typedef {Array<PassengerId | null>} Seats
 */

/**
 * @typedef {Partial<Record<PassengerId, WishCode[]>>} Wishes
 */

/**
 * @typedef {Object} Level
 * @property {Wishes} wishes желания пассажиров станции
 * @property {Seats} start расстановка в начале станции
 */

/**
 * @typedef {Object} Passenger
 * @property {PassengerId} id
 * @property {string} label подпись для экранного диктора
 * @property {{sad: string, glad: string}} art адреса кадров
 */

/**
 * @typedef {Object} Wish
 * @property {WishCode} code
 * @property {'light' | 'door' | 'space' | 'near' | 'far'} icon
 * @property {PassengerId} [faceOf] чьё лицо показать в значке
 * @property {string} hint подпись для экранного диктора
 */

/**
 * @typedef {Object} SeatedPassenger
 * @property {PassengerId} id
 * @property {number} seat
 * @property {WishCode | null} wishCode первое невыполненное желание
 * @property {boolean} isGlad
 */

/**
 * @typedef {Object} SeatState
 * @property {number} index
 * @property {boolean} isGlowing пассажиру в руке здесь будет хорошо
 * @property {boolean} isHinting подсказка первой станции
 */

export {};
