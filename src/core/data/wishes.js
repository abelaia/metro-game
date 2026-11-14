import {PASSENGER_IDS, WISH_CODES} from '@/core/constants';

/** @type {Readonly<Record<import('@/core/types/seating').WishCode, import('@/core/types/seating').Wish>>} */
export const WISHES = Object.freeze({
    [WISH_CODES.light]: Object.freeze({
        code: WISH_CODES.light,
        icon: 'light',
        hint: 'Хочет сидеть под лампой',
    }),
    [WISH_CODES.door]: Object.freeze({
        code: WISH_CODES.door,
        icon: 'door',
        hint: 'Хочет сидеть у двери',
    }),
    [WISH_CODES.space]: Object.freeze({
        code: WISH_CODES.space,
        icon: 'space',
        hint: 'Нужно свободное место рядом',
    }),
    [WISH_CODES.nearRimma]: Object.freeze({
        code: WISH_CODES.nearRimma,
        icon: 'near',
        faceOf: PASSENGER_IDS.rimma,
        hint: 'Хочет сидеть рядом с бабушкой',
    }),
    [WISH_CODES.farAnya]: Object.freeze({
        code: WISH_CODES.farAnya,
        icon: 'far',
        faceOf: PASSENGER_IDS.anya,
        hint: 'Не хочет сидеть рядом с невестой',
    }),
});
