<script setup>
import {CARRIAGE} from '@/core/data/carriage';

const VIEW_BOX = `0 0 ${CARRIAGE.width} ${CARRIAGE.height}`;
const WIND_OFFSETS = Object.freeze([166, 182, 198]);

const DECKS = Object.freeze([
    {id: 'upper', top: 0},
    {id: 'lower', top: CARRIAGE.deckHeight},
]);
</script>

<template>
    <div
        class="carriage-backdrop"
        aria-hidden="true"
    >
        <span class="carriage-backdrop__deck" />
        <span class="carriage-backdrop__deck carriage-backdrop__deck--lower" />
        <svg
            class="carriage-backdrop__overlay"
            :viewBox="VIEW_BOX"
            preserveAspectRatio="none"
        >
            <rect
                class="carriage-backdrop__dusk"
                x="0"
                :y="CARRIAGE.deckHeight"
                :width="CARRIAGE.width"
                :height="CARRIAGE.deckHeight"
            />
            <g
                v-for="deck in DECKS"
                :key="deck.id"
            >
                <path
                    v-for="offset in WIND_OFFSETS"
                    :key="offset"
                    class="carriage-backdrop__wind"
                    :d="`M${CARRIAGE.doorLeft + 4} ${deck.top + offset} q-8 -7 -16 0 t-14 0`"
                />
            </g>
        </svg>
    </div>
</template>

<style lang="scss">
.carriage-backdrop {
    @include cover;

    &__deck {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: $color-wall url('@/assets/art/wagon.webp') top center / 100% 100% no-repeat;

        &--lower {
            top: 50%;
        }
    }

    &__overlay {
        @include cover;
    }

    &__dusk {
        opacity: 0.42;
        fill: $color-shade;
    }

    &__wind {
        opacity: 0.8;
        fill: none;
        stroke: $color-wind;
        stroke-width: 3;
        stroke-linecap: round;
    }
}
</style>
