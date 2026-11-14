<script setup>
import {computed, ref} from 'vue';
import {getNearestSeat} from '@/core/utils/carriage';

import CarriageBackdrop from './CarriageBackdrop.vue';
import CarriageSeat from './CarriageSeat.vue';
import PassengerPiece from './PassengerPiece.vue';

const props = defineProps({
    /** @type {import('vue').PropType<import('@/core/types/seating').SeatedPassenger[]>} */
    passengers: {type: Array, required: true},
    /** @type {import('vue').PropType<import('@/core/types/seating').SeatState[]>} */
    seatStates: {type: Array, required: true},
    heldPassengerId: {type: String, default: null},
    isDeparting: {type: Boolean, default: false},
    isChanging: {type: Boolean, default: false},
    isBusy: {type: Boolean, default: false},
});

const emit = defineEmits(['selectPassenger', 'selectSeat', 'dragStart', 'drop']);

const boardElement = ref(null);
const aimedSeat = ref(null);

const classes = computed(() => ({'carriage-board--changing': props.isChanging}));

function findSeatAt(point) {
    if (!point || !boardElement.value) {
        return null;
    }

    return getNearestSeat(point, boardElement.value.getBoundingClientRect());
}

function handleSelectPassenger(passengerId) {
    emit('selectPassenger', passengerId);
}

function handleSelectSeat(seat) {
    emit('selectSeat', seat);
}

function handleDragStart(passengerId) {
    emit('dragStart', passengerId);
}

function handleDragMove({point}) {
    aimedSeat.value = findSeatAt(point);
}

function handleDragEnd({passengerId, point}) {
    aimedSeat.value = null;
    emit('drop', {passengerId, seat: findSeatAt(point)});
}
</script>

<template>
    <div
        ref="boardElement"
        class="carriage-board"
        :class="classes"
    >
        <CarriageBackdrop />
        <CarriageSeat
            v-for="seatState in seatStates"
            :key="seatState.index"
            :seat-state="seatState"
            :is-aimed="seatState.index === aimedSeat"
            @select="handleSelectSeat"
        />
        <PassengerPiece
            v-for="passenger in passengers"
            :key="passenger.id"
            :passenger="passenger"
            :is-held="passenger.id === heldPassengerId"
            :is-cheering="isDeparting"
            :is-locked="isBusy"
            @select="handleSelectPassenger"
            @drag-start="handleDragStart"
            @drag-move="handleDragMove"
            @drag-end="handleDragEnd"
        />
    </div>
</template>

<style lang="scss">
$carriage-board-reserved-height: 130px;

.carriage-board {
    $block: &;

    position: relative;
    overflow: hidden;
    width: min(100%, calc((100svh - #{$carriage-board-reserved-height}) * #{$carriage-width} / #{$carriage-height}));
    margin: 0 auto;
    user-select: none;
    border: $carriage-frame solid $color-frame;
    border-radius: $radius-card;
    background-color: $color-wall;
    touch-action: none;
    aspect-ratio: #{$carriage-width} / #{$carriage-height};

    &--changing {
        .passenger-piece {
            transition: opacity $duration ease;
            opacity: 0;
        }
    }
}
</style>
