<template>
    <div
        ref="tip"
        :class="['tip', {'tip_active': isActive}]"
        :style="{top: calculatedYPos + 'px', left: pos?.x + 15 + 'px'}"
        >
        <div class="tip__container">
            <div class="tip__title">{{ value }}&nbsp;{{ counterSign }}</div>
            <!-- <div class="tip__title">{{ spacesInDigit(value) }}&nbsp;₽</div> -->
            <div class="tip__descr">{{ descr }}</div> 
        </div>               
        <div 
            class="tip__triangle"
            :style="trianglePos">
        </div> 
    </div>
</template>

<script>
// import spacesInDigit from '@/assets/script/spacesInDigit'
export default {
    name: 'ChartTip',
    props: ['isActive', 'value', 'descr', 'pos', 'canvasHeight', 'counterSign'],
    data() {
        return {
            isMounted: false
        }
    },
    computed: {
        trianglePos() {
            // 
            // if (this.pos?.y <= this.canvasHeight / 2) {
                return {bottom: 0}
            // } else {
                // return {top: 0}
            // }
        },
        calculatedYPos() {
            if (!this.isMounted) return;
            return this.pos?.y - this.$refs.tip.offsetHeight
        }
    },
    methods: {
        // spacesInDigit,
    },
    mounted() {
        this.isMounted = true
    },
}
</script>

<style lang="scss" scoped>
.tip {
    width: fit-content;
    height: auto;
    position: absolute;
    opacity: 0;
    transition: .3s all;
    z-index: 9999;
    user-select: none;
    pointer-events: none;
    &__container {
        background: #FFFFFF;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        padding: 14px 14px 12px 15px;
        position: relative;
        z-index: 2;
    }
    &__triangle {
        position: absolute;
        bottom: 0;
        left: -15px;
        width: 0;
        height: 0;
        border-top: 22px solid transparent;
        border-right: 22px solid #D9D9D9;
        border-bottom: 0px solid transparent;
        z-index: 1;
    }
    &_active {
        opacity: 1;
    }
    &__title {
        font-family: 'Mail Sans Roman';
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 155%;
        color: #262424;
    }
    &__descr {
        margin-top: 4px;
        font-family: 'Mail Sans Roman';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 100%;
        letter-spacing: -0.04em;
        color: #A7A7A7;
    }
}

.dark-mode {
    .tip {
        &__container {
            background: #262626;
            box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);
        }
        &__triangle {
            border-right: 22px solid #262626;
        }
        &__title {
            color: #fff;
        }
    }
}
</style>