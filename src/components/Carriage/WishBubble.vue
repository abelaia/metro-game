<script setup>
import {Armchair, Ban, DoorOpen, Heart, Lightbulb} from 'lucide-vue-next';
import {computed} from 'vue';
import {PASSENGERS} from '@/core/data/passengers';
import {WISHES} from '@/core/data/wishes';

const WISH_ICONS = Object.freeze({
    light: Lightbulb,
    door: DoorOpen,
    space: Armchair,
    near: Heart,
    far: Ban,
});

const props = defineProps({
    wishCode: {
        type: String,
        required: true,
        validator: (value) => Object.keys(WISHES).includes(value),
    },
});

const wish = computed(() => WISHES[props.wishCode]);
const icon = computed(() => WISH_ICONS[wish.value.icon]);
const face = computed(() => (wish.value.faceOf ? PASSENGERS[wish.value.faceOf].art.glad : null));
const iconClasses = computed(() => ({
    'wish-bubble__icon--badge': face.value !== null,
    [`wish-bubble__icon--${wish.value.icon}`]: true,
}));
</script>

<template>
    <span
        class="wish-bubble"
        aria-hidden="true"
    >
        <img
            v-if="face"
            class="wish-bubble__face"
            :src="face"
            alt=""
            draggable="false"
        />
        <component
            :is="icon"
            class="wish-bubble__icon"
            :class="iconClasses"
        />
    </span>
</template>

<style lang="scss">
$wish-bubble-size: 30%;

.wish-bubble {
    position: absolute;
    top: -4%;
    right: 6%;
    overflow: hidden;
    width: $wish-bubble-size;
    transform-origin: 20% 100%;
    pointer-events: none;
    border: 2px solid $color-ink;
    border-radius: $radius-chip;
    background-color: $color-bubble;
    aspect-ratio: 1;

    &__face {
        position: absolute;
        top: 2%;
        left: -80%;
        width: 260%;
        max-width: none;
    }

    &__icon {
        position: absolute;
        top: 19%;
        left: 19%;
        width: 62%;
        height: 62%;
        color: $color-ink;

        &--light {
            color: $color-action;
            fill: $color-action;
        }

        &--door {
            color: $color-frame;
        }

        &--badge {
            top: auto;
            right: 2%;
            bottom: 2%;
            left: auto;
            width: 46%;
            height: 46%;
            color: $color-frame;
            stroke-width: 3;
        }

        &--near {
            fill: $color-frame;
        }
    }
}

.wish-bubble-enter-active,
.wish-bubble-leave-active {
    transition:
        transform $duration $ease-back-out,
        opacity $duration-fast ease;
}

.wish-bubble-enter-from,
.wish-bubble-leave-to {
    transform: scale(0.3);
    opacity: 0;
}
</style>
