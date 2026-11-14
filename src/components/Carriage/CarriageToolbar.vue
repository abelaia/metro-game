<script setup>
import {RotateCcw} from 'lucide-vue-next';

import UiIconButton from '@/components/Ui/UiIconButton.vue';

defineProps({
    stationNumber: {type: Number, required: true},
    isBusy: {type: Boolean, default: false},
});

const emit = defineEmits(['restart']);

function handleRestart() {
    emit('restart');
}
</script>

<template>
    <header class="carriage-toolbar">
        <h1 class="carriage-toolbar__title">Рассадка</h1>
        <p class="carriage-toolbar__station">
            Станция
            <span class="carriage-toolbar__number">{{ stationNumber }}</span>
        </p>
        <UiIconButton
            label="Начать станцию заново"
            :is-disabled="isBusy"
            @click="handleRestart"
        >
            <RotateCcw
                :size="24"
                aria-hidden="true"
            />
        </UiIconButton>
    </header>
</template>

<style lang="scss">
$carriage-toolbar-height: 48px;

.carriage-toolbar {
    display: flex;
    align-items: center;
    min-height: $carriage-toolbar-height;
    gap: $indent-step * 3;

    &__title {
        flex: 1;
        min-width: 0;

        @include display;
    }

    &__station {
        color: $color-on-night-soft;
        font-size: $font-size-sm;
    }

    &__number {
        color: $color-on-night;

        @include display;
        @include margin('left', 1);
    }
}
</style>
