import {PASSENGER_IDS} from '@/core/constants';

import anyaGlad from '@/assets/art/anya-glad.webp';
import anyaSad from '@/assets/art/anya-sad.webp';
import catGlad from '@/assets/art/cat-glad.webp';
import catSad from '@/assets/art/cat-sad.webp';
import dinoGlad from '@/assets/art/dino-glad.webp';
import dinoSad from '@/assets/art/dino-sad.webp';
import ficusGlad from '@/assets/art/ficus-glad.webp';
import ficusSad from '@/assets/art/ficus-sad.webp';
import rimmaGlad from '@/assets/art/rimma-glad.webp';
import rimmaSad from '@/assets/art/rimma-sad.webp';

/** @type {Readonly<Record<import('@/core/types/seating').PassengerId, import('@/core/types/seating').Passenger>>} */
export const PASSENGERS = Object.freeze({
    [PASSENGER_IDS.dino]: Object.freeze({
        id: PASSENGER_IDS.dino,
        label: 'Парень в костюме динозавра',
        art: Object.freeze({sad: dinoSad, glad: dinoGlad}),
    }),
    [PASSENGER_IDS.rimma]: Object.freeze({
        id: PASSENGER_IDS.rimma,
        label: 'Бабушка со скейтбордом',
        art: Object.freeze({sad: rimmaSad, glad: rimmaGlad}),
    }),
    [PASSENGER_IDS.anya]: Object.freeze({
        id: PASSENGER_IDS.anya,
        label: 'Невеста с рюкзаком',
        art: Object.freeze({sad: anyaSad, glad: anyaGlad}),
    }),
    [PASSENGER_IDS.cat]: Object.freeze({
        id: PASSENGER_IDS.cat,
        label: 'Кот',
        art: Object.freeze({sad: catSad, glad: catGlad}),
    }),
    [PASSENGER_IDS.ficus]: Object.freeze({
        id: PASSENGER_IDS.ficus,
        label: 'Фикус',
        art: Object.freeze({sad: ficusSad, glad: ficusGlad}),
    }),
});
