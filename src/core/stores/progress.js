import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {STORAGE_KEYS} from '@/core/constants';
import {safeStorage} from '@/core/helpers/safeStorage';

function readStationIndex() {
    const saved = Number.parseInt(safeStorage.get(STORAGE_KEYS.station) ?? '', 10);

    return Number.isInteger(saved) && saved > 0 ? saved : 0;
}

export const useProgressStore = defineStore('progress', () => {
    const stationIndex = ref(readStationIndex());

    const stationNumber = computed(() => stationIndex.value + 1);

    function completeStation() {
        stationIndex.value += 1;
        safeStorage.set(STORAGE_KEYS.station, String(stationIndex.value));
    }

    function resetProgress() {
        stationIndex.value = 0;
        safeStorage.set(STORAGE_KEYS.station, null);
    }

    return {stationIndex, stationNumber, completeStation, resetProgress};
});
