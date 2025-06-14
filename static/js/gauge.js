import { getCSSVariable } from "./utils.js";
let gauge;

function initGauge() {
    const opts = {
        angle: 0,
        lineWidth: 0.15,
        radiusScale: 0.9,
        pointer: {
            length: 0.5,
            strokeWidth: 0.025,
            color: getCSSVariable('--speedometer_gradient_2')
        },
        staticLabels: {
            font: "11px sans-serif",
            labels: [],
            color: "#ffffff",
            fractionDigits: 0
        },

        percentColors: [[0.0, "getCSSVariable('--speedometer_gradient_1')"], [0.50, getCSSVariable('--speedometer_gradient_2')], [1.0, getCSSVariable('--speedometer_gradient_3')]],
        limitMax: false,
        limitMin: false,
        highDpiSupport: true,
    };

    const target = document.getElementById('speedometer');
    gauge = new Gauge(target).setOptions(opts);
    gauge.maxValue = 10;
    gauge.setMinValue(0);
    gauge.animationSpeed = 32;
    gauge.set(0);
}

function updateGauge(value) {
    if (value > gauge.maxValue || value < gauge.maxValue / 5) {
        let newMax = value > 0 ? value * 1.2 : 1;

        const niceSteps = [1, 2, 5];
        let step;
        const magnitude = Math.pow(10, Math.floor(Math.log10(newMax / 5)));
        for (let i = 0; i < niceSteps.length; i++) {
            step = niceSteps[i] * magnitude;
            if (newMax / step < 6) {
                break;
            }
        }
        
        gauge.maxValue = Math.ceil(newMax / step) * step;

        const labels = [];
        const numLabels = Math.round(gauge.maxValue / step);
        for (let i = 0; i <= numLabels; i++) {
            labels.push(parseFloat((i * step).toPrecision(15)));
        }

        gauge.setOptions({
            staticLabels: {
                font: "11px sans-serif",
                labels: labels,
                color: "#ffffff",
                fractionDigits: step < 1 ? 2 : 0
            }
        });
    }
    gauge.set(value);
    document.getElementById('current-value').innerText = value.toFixed(2);
}

export { initGauge, updateGauge }; 
