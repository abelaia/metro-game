<template>
    <main class="default-layout">
        <slot />
    </main>
</template>

<style lang="scss">
.default-layout {
    max-width: $page-max-width;
    min-height: 100svh;
    margin: 0 auto;
    padding-right: max(#{$page-gutter}, env(safe-area-inset-right, 0px));
    padding-left: max(#{$page-gutter}, env(safe-area-inset-left, 0px));

    @include padding('top', 4);
    @include padding('bottom', 6);
}
</style>
