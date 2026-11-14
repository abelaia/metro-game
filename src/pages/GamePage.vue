<script setup>
import {useSeating} from '@/composables/useSeating';

import CarriageBoard from '@/components/Carriage/CarriageBoard.vue';
import CarriageToolbar from '@/components/Carriage/CarriageToolbar.vue';

const {
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
} = useSeating();
</script>

<template>
    <section class="game-page">
        <CarriageToolbar
            :station-number="stationNumber"
            :is-busy="isBusy"
            @restart="restart"
        />
        <CarriageBoard
            :passengers="passengers"
            :seat-states="seatStates"
            :held-passenger-id="heldPassengerId"
            :is-departing="isDeparting"
            :is-changing="isChanging"
            :is-busy="isBusy"
            @select-passenger="selectPassenger"
            @select-seat="selectSeat"
            @drag-start="startDrag"
            @drop="dropPassenger"
        />
    </section>
</template>

<style lang="scss">
.game-page {
    @include column($indent-step * 4);
}
</style>
