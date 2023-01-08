<template>
    <div :class="['dot', {'dot_active': isActive}]"
        :style="{top: top + 'px', left: left + 'px', color: color, transition: `.3s ${anim}`}"
    >
    </div>
</template>

<script>
export default {
    name: 'ChartDot',
    props: ['isActive', 'top', 'left', 'color', 'anim']
}
</script>

<style lang="scss" scoped>
.dot {
    width: 14px;
    height: 14px;
    opacity: 0;
    position: absolute;
    border-radius: 100%;
    background: #fff;
    display: block;
    z-index: 4;
    transition: .3s all;
    pointer-events: none;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.25);
    &:before {
        content: '';
        width: 6px;
        height: 6px;
        background: #262424;
        position: absolute;
        border-radius: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        z-index: 5;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    }
    &_active {
        opacity: 1;
    }
}
</style>