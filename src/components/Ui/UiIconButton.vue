<script setup>
defineProps({
    label: {type: String, required: true},
    isDisabled: {type: Boolean, default: false},
});
</script>

<template>
    <button
        class="ui-icon-button"
        type="button"
        :aria-label="label"
        :disabled="isDisabled"
    >
        <slot />
    </button>
</template>

<style lang="scss">
$ui-icon-button-size: 48px;

.ui-icon-button {
    width: $ui-icon-button-size;
    height: $ui-icon-button-size;
    transition:
        background-color $duration-fast ease,
        transform $duration-fast ease;
    color: $color-on-night;
    border-radius: $radius-chip;

    @include button-reset;
    @include flex-center;

    @include hover {
        background-color: $color-night-raised;
    }

    &:active {
        transform: scale(0.94);
    }

    &:disabled {
        cursor: default;
        transform: none;
        color: $color-on-night-soft;
        background-color: transparent;
    }
}
</style>
