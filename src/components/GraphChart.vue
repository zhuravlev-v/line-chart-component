<template>
    <div class="graph">
        <div class="graph__inner" v-if="validData">
            <div class="graph__left-data">
                <div v-for="item in divisionValues" :key="item">
                    {{ separateThousands(item) }}
                </div>
            </div>
            <div class="graph__canvas-container" @mouseover="canvasHovered = true" @mouseleave="canvasHovered = false">
                <p v-if="!chartData.length" class="graph__no-data">нет данных</p>
                <chart-dot
                    class="desktop"
                    :isActive="(activeLabel !== null && chartData.length) || canvasHovered"
                    :top="dotPos.y"
                    :left="dotPos.x"
                    anim="all"
                ></chart-dot>
                <div
                    class="graph__dashed-line"
                    :class="{'graph__dashed-line_active': activeLabel !== null}"
                    :style="{height: dashedLineUnderDot.height + 'px', left: dashedLineUnderDot.x + 7 + 'px' }">
                </div>
                <chart-tip
                    class="desktop"
                    :isActive="canvasHovered"
                    :value="chartData[0][activeLabel] ? String(chartData[0][activeLabel]) : 0"
                    :counterSign="counter"
                    descr="Выручка"
                    :pos="posOfTips(0)"
                    :canvasHeight="$refs.graph?.height"
                >
                </chart-tip>
                <canvas :width="canvasScreen.width" :height="canvasScreen.height" ref="graph"></canvas>
                <div class="graph__right-data">
                    <div
                        ref="labelWidth"
                        v-for="(item, i) in labels"
                        :key="item.label"
                        :class="[
                            'graph__label',
                            {'graph__label_active': activeLabel === i}
                        ]"
                        :style="{width: labelWidth}">
                        <div
                            class="graph__hover-container"
                            @mouseenter="hoverLabel($event, i)"
                            @mouseleave="unHoverLabel">
                        </div>
                        <span>{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="graph__inner" v-else>
            <p class="graph__no-data">нет данных</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GraphChart',
    props: ['chartData', 'year', 'counter', 'labels'],
    data() {
        return {
            canvasHovered: false,
            isMounted: false,
            activeLabel: null,
            divisionValue: 0,
            valuesPeaks: [],
            dotPos: {
                x: 0,
                y: 0
            },
            dashedLineUnderDot: {
                height: 0,
                x: 0
            }
        }
    },
    computed: {
        validData() {
            return Array.isArray(this.chartData) && this.chartData.length > 0
        },
        colors() {
            return this.$store.state.chartStore.graphChartColors
        },
        canvas() {
            return this.$refs.graph
        },
        divisionValues() {
            let arr = [];
            let maxValue = -1000;
            let minValue = 999999999999;
            this.chartData.forEach(item => {
                item.forEach(element => {
                    if (element > maxValue) maxValue = element;
                    if (element < minValue) minValue = element;
                })
            })


            this.divisionValue = (maxValue - minValue) / 4;
            arr.push(maxValue + this.divisionValue)
            for (let i = 4; i >= 0; i--) {
                arr.push(i * this.divisionValue)
            }

            return arr;
        },
        chartValues() {
            if (!this.isMounted) return;
            const height = this.canvas.height - 3;
            const labels = this.$refs.labelWidth;
            const max = this.divisionValues[0];
            const width = this.canvas.offsetWidth;
            const values = [];

            const calculateX = (i, j) => {
                const offset = labels[i].offsetWidth / 2;
                if (j)
                    return (this.canvas.width / labels.length) * i + offset
                return (width / labels.length) * i + offset;
            }
            const calculateY = val => {
                const percent = val / max * 100;
                return height - (height / 100 * percent) + 2
            }

            const fillArray = () => {

                this.chartData.forEach(item => {
                    const currentValues = [];
                    const peaks = [];
                    item.forEach((element, i) => {
                        if (element !== null) {
                            currentValues.push({x: calculateX(i, true), y: calculateY(element)})
                        }
                        if (element !== null) {
                            peaks.push({x: calculateX(i, false), y: calculateY(element)})
                            // currentValues.push({x: calculateX(i, true), y: calculateY(element)})
                        }
                    })
                    values.push(currentValues);
                    this.valuesPeaks.push(peaks)
                })
            }

            fillArray()

            return values;
        },
        canvasScreen() {
            if (this.$screen.width > 1350)
                return {width: 1000, height: 246}
            else
                return {width: (this.$screen.width - 32 - 50), height: 140}
        },
        labelWidth() {
            if (this.$screen.width > 1350)
                return ''
            else
                return ((this.$screen.width - 32 - 50) / this.labels.length) + 'px'
        }
    },
    methods: {
        posOfTips(i) {
            // if (!this.activeLabel || !this.valuesPeaks[i][this.activeLabel]) {
            //     return {
            //         x: this.dashedLineUnderDot.x + 7,
            //         y: this.dotPos.y + 7
            //     }
            // }
            if (this.valuesPeaks[i]) {
                return this.valuesPeaks[i][this.activeLabel]
            }
        },
        hoverLabel(e, i) {
            this.activeLabel = i
            if (!this.valuesPeaks[0][this.activeLabel]) {
                const labels = this.$refs.labelWidth;
                const offset = labels[i].offsetWidth / 2;
                console.log(offset);
                this.dotPos.x = this.valuesPeaks[0][this.valuesPeaks[0].length - 1].x - 7;
                this.dotPos.y = this.valuesPeaks[0][this.valuesPeaks[0].length - 1].y - 7;
                this.dashedLineUnderDot.x = this.valuesPeaks[0][this.valuesPeaks[0].length - 1].x - 7;
                this.dashedLineUnderDot.height = this.canvas.height - this.dotPos.y;

                this.canvasHovered = true;
                return
            }
            // console.log(this.posOfTips(i));
            this.dotPos.x = this.posOfTips(0).x - 7;
            this.dotPos.y = this.posOfTips(0).y - 7;

            this.dashedLineUnderDot.x = this.dotPos.x;
            this.dashedLineUnderDot.height = this.canvas.height - this.dotPos.y;
            this.canvasHovered = true;
        },
        unHoverLabel() {
            this.activeLabel = null;
            this.canvasHovered = false;
        },
        drawDashedLine(ctx, startX, startY, endX, endY, color, width, space) {
            const innerWidth = width ? width * 2 : 10;
            const innerSpace = space ? space * 3 : 9;
            ctx.setLineDash([20, 25]);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = '#EDEDED';
            ctx.lineWidth = 1;
            ctx.closePath();
            ctx.stroke();


            // DrawDottedLine(300,400,7,7,7,20,"green");
            //
            // const DrawDottedLine = (x1,y1,x2,y2,dotRadius,dotCount,dotColor) => {
            //     var dx=x2-x1;
            //     var dy=y2-y1;
            //     var spaceX=dx/(dotCount-1);
            //     var spaceY=dy/(dotCount-1);
            //     var newX=x1;
            //     var newY=y1;
            //     for (var i=0;i<dotCount;i++){
            //         drawDot(newX,newY,dotRadius,dotColor);
            //         newX+=spaceX;
            //         newY+=spaceY;
            //     }
            //     drawDot(x1,y1,3,"red");
            //     drawDot(x2,y2,3,"red");
            // }
            // const drawDot = (x,y,dotRadius,dotColor) => {
            //     ctx.beginPath();
            //     ctx.arc(x,y, dotRadius, 0, 2 * Math.PI, false);
            //     ctx.fillStyle = dotColor;
            //     ctx.fill();
            // }
        },
        drawCurve(ctx, ptsa, color) {
            ctx.strokeStyle = /* '#E83D46' */ color
            ctx.lineWidth = 3
            ctx.setLineDash([0, 0]);
            var points = ptsa
            ctx.beginPath();
            // move to the first point
            ctx.moveTo((points[0].x), points[0].y);
            for(var i = 0; i < points.length-1; i ++) {
                var x_mid = (points[i].x + points[i+1].x) / 2;
                var y_mid = (points[i].y + points[i+1].y) / 2;
                var cp_x1 = (x_mid + points[i].x) / 2;
                var cp_x2 = (x_mid + points[i+1].x) / 2;
                ctx.quadraticCurveTo(cp_x1,points[i].y ,x_mid, y_mid);
                ctx.quadraticCurveTo(cp_x2,points[i+1].y,points[i+1].x,points[i+1].y);
            }
            ctx.stroke();
            ctx.closePath();
        },
        clearCanvas() {
            this.canvas.getContext('2d').clearRect(0,0,this.canvas.width,this.canvas.height)
        },
        initCanvas() {
            this.clearCanvas();

            const offset = this.canvas.height / 5;
            const lines = this.canvas.height / offset;
            for (let i = 0; i <= lines; i++) {
                this.drawDashedLine(
                    this.canvas.getContext('2d'),
                    0,
                    i * offset + 1,
                    this.canvas.width,
                    i * offset + 1,
                    '#a7a7a7',
                    6
                );
            }
            this.drawDashedLine(
                this.canvas.getContext('2d'),
                0,
                this.canvas.height - 1,
                this.canvas.width,
                this.canvas.height - 1,
                '#a7a7a7',
                6
            );

            this.chartValues.forEach((values, i) => {
                this.drawCurve(this.canvas.getContext('2d'), values, this.colors[i]);
            });
        },
        separateThousands(number) {
            // let k = 0;
            // let newNumber = number + '';

            // for (let i = newNumber.length; i >= newNumber.length - 3; i -= 3) {
            //     if (newNumber.length > 3) {
            //         newNumber = newNumber.substring(0, newNumber.length - 3);
            //         k++;
            //     }
            // }

            // for (let i = 0; i < k; i++) {
            //     newNumber += 'k';
            // }

            // return newNumber

            if (isNaN(number)) throw new Error(number + " is not a Number!");
            let num = Math.trunc(number)

            let digitСapacity = {
                "0": "",
                "1": "k",
                "2": "kk",
                "3": "kkk",
            };

            let thousands = Math.floor((("" + num).length - 1) / 3);

            let coef = 1000 ** thousands;

            if (digitСapacity[thousands] > 2) {
                return (num / coef).toFixed(1) + digitСapacity[thousands]
            } else {
                return Math.trunc((num / coef).toFixed(1)) + digitСapacity[thousands]
            }
        },
    },
    mounted() {
        this.isMounted = true;
        this.initCanvas();
    },
}
</script>

<style lang="scss" scoped>
.graph {
    max-width: 810px;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    border-radius: 0px 5px 5px 0px;
    padding: 52px 29px 50px 27px;
    height: 350px;
    transition: .3s all;
    @media (max-width: 1350px) {
        height: 200px;
        padding: 30px 25px;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
        border-radius: 0px 0px 5px 5px;
        max-width: unset;
    }
    &__inner {
        height: 100%;
        display: flex;
        width: 100%;
        gap: 10px;
        
        &:has(.graph__no-data) {
            position: relative;
        }
    }
    &__canvas-container {
        position: relative;
        width: 100%;
    }
    &__right-data {
        display: flex;
        justify-content: space-between;
        margin-top: 9px;
        max-width: 100%;
        @media (max-width: 1350px) {
            width: 100%;
        }
    }
    &__left-data {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        font-family: 'Mail Sans Roman';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        color: #A7A7A7;
        @media (max-width: 1350px) {
            display: none;
        }
    }
    &__hover-container {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        display: block;
        transform: translateY(calc(-100% - 15px));
        z-index: 99;
        background: transparent;
        height: 246px;
        @media (max-width: 1350px) {
            display: none;
        }
        /* background: rgba(0,0,0,.1);
        border: 1px solid; */
    }
    & canvas {
        max-width: 100%;
        height: 100%;
        max-height: 246px;
    }
    &__dashed-line {
        position: absolute;
        width: 0;
        border-right: 1px dashed #E83D46;
        opacity: 0;
        transition: .3s all;
        bottom: 0;
        &_active {
            opacity: 1;
        }
    }
    &__label {
        font-family: 'Mail Sans Roman';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 155%;
        color: #A7A7A7;
        transition: .3s all;
        position: relative;
        width: 100%;
        text-align: center;
        &_active {
            color: #E83D46;
        }
        @media (max-width: 1350px) {
            opacity: 0;
            pointer-events: none;
        }
    }
    &__no-data {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Mail Sans Roman';
        font-style: normal;
        font-weight: 700;
        font-size: 32px;
        line-height: 155%;
        text-transform: uppercase;
        color: #000000;
        opacity: 0.1;
    }
}

.dark-mode {
    .graph {
        background: #262424;
    }
}
</style>
