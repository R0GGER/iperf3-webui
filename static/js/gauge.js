let gauge;

function initGauge() {
    const opts = {
        angle: 0,
        lineWidth: 0.15,
        radiusScale: 0.9,
        pointer: {
            length: 0.5,
            strokeWidth: 0.025,
            color: '#00E1FF'
        },
        staticLabels: {
            font: "11px sans-serif",
            labels: [],
            color: "#ffffff",
            fractionDigits: 0
        },
        percentColors: [[0.0, "#EC30BD" ], [0.50, "#4FA6E9"], [1.0, "#00E1FF"]],
        limitMax: false,
        limitMin: false,
        highDpiSupport: true,
    };

    const target = document.getElementById('speedometer');
    gauge = new Gauge(target).setOptions(opts);
    gauge.maxValue = 100;
    gauge.setMinValue(0);
    gauge.animationSpeed = 32;
    gauge.set(0);
}

function updateGauge(value) {
    if (value > gauge.maxValue) {
        const newMax = value * 1.2;
        const step = newMax / 5; // 5 intervals
        const niceStep = Math.ceil(step / 100) * 100;
        
        gauge.maxValue = niceStep * 5;
        gauge.setOptions({
            staticLabels: {
                font: "11px sans-serif",
                labels: [0, niceStep, niceStep * 2, niceStep * 3, niceStep * 4, gauge.maxValue],
                color: "#ffffff",
                fractionDigits: 0
            }
        });
    }
    gauge.set(value);
    document.getElementById('current-value').innerText = value.toFixed(2);
}

export { initGauge, updateGauge }; 