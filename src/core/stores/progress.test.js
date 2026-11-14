import {createPinia, setActivePinia} from 'pinia';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {STORAGE_KEYS} from '@/core/constants';

import {useProgressStore} from './progress';

function createStorage(initial = {}) {
    const values = new Map(Object.entries(initial));

    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
}

describe('progress store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('начинает с первой станции, если сохранения нет', () => {
        vi.stubGlobal('localStorage', createStorage());

        expect(useProgressStore().stationNumber).toBe(1);
    });

    it('продолжает с сохранённой станции', () => {
        vi.stubGlobal('localStorage', createStorage({[STORAGE_KEYS.station]: '4'}));

        expect(useProgressStore().stationNumber).toBe(5);
    });

    it('не доверяет испорченному сохранению', () => {
        vi.stubGlobal('localStorage', createStorage({[STORAGE_KEYS.station]: 'abc'}));

        expect(useProgressStore().stationIndex).toBe(0);
    });

    it('сохраняет пройденную станцию', () => {
        const storage = createStorage();
        vi.stubGlobal('localStorage', storage);

        useProgressStore().completeStation();

        expect(storage.getItem(STORAGE_KEYS.station)).toBe('1');
    });

    it('сбрасывает прогресс', () => {
        const storage = createStorage({[STORAGE_KEYS.station]: '3'});
        vi.stubGlobal('localStorage', storage);
        const store = useProgressStore();

        store.resetProgress();

        expect(store.stationIndex).toBe(0);
        expect(storage.getItem(STORAGE_KEYS.station)).toBeNull();
    });

    it('работает без доступа к хранилищу', () => {
        vi.stubGlobal('localStorage', undefined);
        const store = useProgressStore();

        store.completeStation();

        expect(store.stationNumber).toBe(2);
    });
});
