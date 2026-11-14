import {storeToRefs} from 'pinia';
import {computed, onScopeDispose, ref, shallowRef} from 'vue';
import {PASSENGER_IDS, SEAT_INDEXES} from '@/core/constants';
import {ENDLESS_LEVELS, LEVELS} from '@/core/data/levels';
import {useProgressStore} from '@/core/stores/progress';
import {createShuffledLevel, getUnmetWish, getWelcomeSeats, isEveryoneGlad, swapSeats} from '@/core/utils/seating';

/** @typedef {import('@/core/types/seating').PassengerId} PassengerId */

const DEPARTURE_DURATION_MS = 1500;
const CHANGE_DURATION_MS = 240;
const TUTORIAL_PASSENGER = PASSENGER_IDS.ficus;

/**
 * @param {number} stationIndex
 * @returns {import('@/core/types/seating').Level}
 */
function getLevel(stationIndex) {
    if (stationIndex < LEVELS.length) {
        return LEVELS[stationIndex];
    }

    return createShuffledLevel(ENDLESS_LEVELS[stationIndex % ENDLESS_LEVELS.length]);
}

export function useSeating() {
    const progressStore = useProgressStore();
    const {stationIndex, stationNumber} = storeToRefs(progressStore);

    const level = shallowRef(getLevel(stationIndex.value));
    /** @type {import('vue').Ref<import('@/core/types/seating').Seats>} */
    const seats = ref([...level.value.start]);
    /** @type {import('vue').Ref<PassengerId | null>} */
    const heldPassengerId = ref(null);
    const isDeparting = ref(false);
    const isChanging = ref(false);
    const hasMoved = ref(false);

    const isBusy = computed(() => isDeparting.value || isChanging.value);
    const passengers = computed(() =>
        Object.keys(level.value.wishes).map((passengerId) => {
            const wishCode = getUnmetWish(passengerId, seats.value, level.value.wishes);

            return {id: passengerId, seat: seats.value.indexOf(passengerId), wishCode, isGlad: wishCode === null};
        }),
    );
    const isTutorial = computed(() => stationIndex.value === 0 && !hasMoved.value && heldPassengerId.value === null);
    const seatStates = computed(() => {
        const glowing = heldPassengerId.value
            ? getWelcomeSeats(heldPassengerId.value, seats.value, level.value.wishes)
            : [];
        const hinting = isTutorial.value ? getWelcomeSeats(TUTORIAL_PASSENGER, seats.value, level.value.wishes) : [];

        return SEAT_INDEXES.map((index) => ({
            index,
            isGlowing: glowing.includes(index),
            isHinting: hinting.includes(index),
        }));
    });

    let departureTimer = null;
    let changeTimer = null;

    onScopeDispose(() => {
        clearTimeout(departureTimer);
        clearTimeout(changeTimer);
    });

    function startStation() {
        level.value = getLevel(stationIndex.value);
        seats.value = [...level.value.start];
        heldPassengerId.value = null;
        hasMoved.value = false;
    }

    function arrive() {
        progressStore.completeStation();
        startStation();
        isDeparting.value = false;
        changeTimer = setTimeout(() => {
            isChanging.value = false;
        }, CHANGE_DURATION_MS);
    }

    function depart() {
        isDeparting.value = true;
        departureTimer = setTimeout(() => {
            isChanging.value = true;
            changeTimer = setTimeout(arrive, CHANGE_DURATION_MS);
        }, DEPARTURE_DURATION_MS);
    }

    /**
     * @param {PassengerId} passengerId
     * @param {number} seat
     */
    function movePassenger(passengerId, seat) {
        heldPassengerId.value = null;

        if (seats.value.indexOf(passengerId) === seat) {
            return;
        }

        seats.value = swapSeats(seats.value, passengerId, seat);
        hasMoved.value = true;

        if (isEveryoneGlad(seats.value, level.value.wishes)) {
            depart();
        }
    }

    /** @param {PassengerId} passengerId */
    function selectPassenger(passengerId) {
        if (isBusy.value) {
            return;
        }

        if (heldPassengerId.value && heldPassengerId.value !== passengerId) {
            movePassenger(heldPassengerId.value, seats.value.indexOf(passengerId));

            return;
        }

        heldPassengerId.value = heldPassengerId.value === passengerId ? null : passengerId;
    }

    /** @param {number} seat */
    function selectSeat(seat) {
        if (isBusy.value || !heldPassengerId.value) {
            return;
        }

        movePassenger(heldPassengerId.value, seat);
    }

    /** @param {PassengerId} passengerId */
    function startDrag(passengerId) {
        heldPassengerId.value = passengerId;
    }

    /** @param {{passengerId: PassengerId, seat: number | null}} drop */
    function dropPassenger({passengerId, seat}) {
        if (seat === null) {
            heldPassengerId.value = null;

            return;
        }

        movePassenger(passengerId, seat);
    }

    function restart() {
        if (isBusy.value) {
            return;
        }

        seats.value = [...level.value.start];
        heldPassengerId.value = null;
    }

    return {
        stationNumber,
        passengers,
        seatStates,
        heldPassengerId,
        isDeparting,
        isChanging,
        isBusy,
        selectPassenger,
        selectSeat,
        startDrag,
        dropPassenger,
        restart,
    };
}
