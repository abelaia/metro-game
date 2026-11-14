<script setup>
import {computed} from 'vue';
import {SEATS_PER_ROW} from '@/core/constants';
import {getSeatBox} from '@/core/utils/carriage';
import {getSeatRow} from '@/core/utils/seating';

const DECK_NAMES = Object.freeze(['Верхний', 'Нижний']);

const props = defineProps({
    /** @type {import('vue').PropType<import('@/core/types/seating').SeatState>} */
    seatState: {type: Object, required: true},
    isAimed: {type: Boolean, default: false},
});

const emit = defineEmits(['select']);

const label = computed(() => {
    const deckName = DECK_NAMES[getSeatRow(props.seatState.index)];

    return `${deckName} этаж, место ${(props.seatState.index % SEATS_PER_ROW) + 1}`;
});
const positionStyle = computed(() => {
    const box = getSeatBox(props.seatState.index);

    return {'--seat-left': `${box.left}%`, '--seat-top': `${box.top}%`};
});
const classes = computed(() => ({
    'carriage-seat--glowing': props.seatState.isGlowing || props.seatState.isHinting,
    'carriage-seat--aimed': props.isAimed,
}));

function handleClick() {
    emit('select', props.seatState.index);
}
</script>

<template>
    <button
        class="carriage-seat"
        :class="classes"
        :style="positionStyle"
        type="button"
        :aria-label="label"
        @click="handleClick"
    />
</template>

<style lang="scss">
$carriage-seat-width: 22.2%;
$carriage-seat-height: 25.5%;

.carriage-seat {
    $block: &;

    position: absolute;
    top: var(--seat-top);
    left: var(--seat-left);
    width: $carriage-seat-width;
    height: $carriage-seat-height;
    border-radius: $radius-card-inner;

    @include button-reset;

    &::after {
        position: absolute;
        z-index: $ui-index-3;
        top: 2%;
        right: 3%;
        bottom: 2%;
        left: 3%;
        content: '';
        transition:
            opacity $duration-fast ease,
            transform $duration $ease-out;
        transform: scale(0.92);
        pointer-events: none;
        opacity: 0;
        border: 3px solid $color-action;
        border-radius: $radius-card-inner;
        background-color: rgba($color-action, 22%);
    }

    &--glowing {
        &::after {
            transform: scale(1);
            opacity: 0.85;
        }
    }

    &--aimed {
        &::after {
            transform: scale(1.04);
            opacity: 1;
        }
    }
}
</style>
