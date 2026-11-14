<script setup>
import {computed, ref, watch} from 'vue';
import {usePointerDrag} from '@/composables/usePointerDrag';
import {PASSENGERS} from '@/core/data/passengers';
import {WISHES} from '@/core/data/wishes';
import {getPieceOffset} from '@/core/utils/carriage';
import {getSeatRow} from '@/core/utils/seating';

import WishBubble from './WishBubble.vue';

const GLAD_HINT = 'Всё устраивает';

const props = defineProps({
    /** @type {import('vue').PropType<import('@/core/types/seating').SeatedPassenger>} */
    passenger: {type: Object, required: true},
    isHeld: {type: Boolean, default: false},
    isCheering: {type: Boolean, default: false},
    isLocked: {type: Boolean, default: false},
});

const emit = defineEmits(['select', 'dragStart', 'dragMove', 'dragEnd']);

const {offset, isDragging, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel, consumeDrag} =
    usePointerDrag({
        canDrag: () => !props.isLocked,
        onStart: () => emit('dragStart', props.passenger.id),
        onMove: (point) => emit('dragMove', {passengerId: props.passenger.id, point}),
        onEnd: (point) => emit('dragEnd', {passengerId: props.passenger.id, point}),
    });

const isHopping = ref(false);

const profile = computed(() => PASSENGERS[props.passenger.id]);
const label = computed(() => {
    const hint = props.passenger.wishCode ? WISHES[props.passenger.wishCode].hint : GLAD_HINT;

    return `${profile.value.label}. ${hint}`;
});
const positionStyle = computed(() => {
    const seatOffset = getPieceOffset(props.passenger.seat);

    return {
        '--seat-x': `${seatOffset.x}%`,
        '--seat-y': `${seatOffset.y}%`,
        '--drag-x': `${offset.value.x}px`,
        '--drag-y': `${offset.value.y}px`,
    };
});
const classes = computed(() => ({
    'passenger-piece--lower': getSeatRow(props.passenger.seat) > 0,
    'passenger-piece--held': props.isHeld,
    'passenger-piece--dragging': isDragging.value,
    'passenger-piece--glad': props.passenger.isGlad,
    'passenger-piece--hopping': isHopping.value,
    'passenger-piece--cheering': props.isCheering,
}));

watch(
    () => props.passenger.isGlad,
    (isGlad, wasGlad) => {
        if (isGlad && !wasGlad) {
            isHopping.value = true;
        }
    },
);

function handleClick() {
    if (consumeDrag() || props.isLocked) {
        return;
    }

    emit('select', props.passenger.id);
}

function handleHopEnd() {
    isHopping.value = false;
}
</script>

<template>
    <button
        class="passenger-piece"
        :class="classes"
        :style="positionStyle"
        type="button"
        :aria-label="label"
        :aria-pressed="isHeld"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @click="handleClick"
    >
        <span
            class="passenger-piece__figure"
            @animationend="handleHopEnd"
        >
            <img
                class="passenger-piece__art passenger-piece__art--sad"
                :src="profile.art.sad"
                alt=""
                draggable="false"
            />
            <img
                class="passenger-piece__art passenger-piece__art--glad"
                :src="profile.art.glad"
                alt=""
                draggable="false"
            />
        </span>
        <Transition name="wish-bubble">
            <WishBubble
                v-if="passenger.wishCode"
                :wish-code="passenger.wishCode"
            />
        </Transition>
    </button>
</template>

<style lang="scss">
$passenger-piece-size: 38.889%;

.passenger-piece {
    $block: &;

    position: absolute;
    z-index: $ui-index-1;
    top: 0;
    left: 0;
    width: $passenger-piece-size;
    cursor: grab;
    transition: transform $duration $ease-out;
    transform: translate(calc(var(--seat-x) + var(--drag-x)), calc(var(--seat-y) + var(--drag-y)));
    touch-action: none;
    aspect-ratio: 1;
    -webkit-tap-highlight-color: transparent;

    @include button-reset;

    &__figure {
        transition: transform $duration $ease-back-out;
        transform-origin: 50% 76%;
        pointer-events: none;

        @include cover;
    }

    &__art {
        opacity: 0;

        @include cover;

        &--sad {
            opacity: 1;
        }
    }

    &--lower {
        z-index: $ui-index-2;
    }

    &--glad {
        #{$block}__art--sad {
            opacity: 0;
        }

        #{$block}__art--glad {
            opacity: 1;
        }
    }

    &--held {
        z-index: $ui-index-4;

        #{$block}__figure {
            transform: translateY(-5%) scale(1.08);
        }
    }

    &--dragging {
        cursor: grabbing;
        transition: none;
    }

    &--hopping {
        #{$block}__figure {
            animation: passenger-hop $duration-slow $ease-back-out;
        }
    }

    &--cheering {
        #{$block}__figure {
            animation: passenger-cheer 0.5s ease-in-out infinite alternate;
        }
    }
}
</style>
