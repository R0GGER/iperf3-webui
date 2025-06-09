import state from './state.js';
import { updateSpeedometer } from './speedometer.js';

const runBtn = document.getElementById('runBtn');
const targetInput = document.getElementById('target');
const targetPort = document.getElementById('port');
const streamsInput = document.getElementById('streams');
const resultEl = document.getElementById('result');
const bandwidth_value = document.getElementById('bandwidth');

runBtn.addEventListener('click', async () => {
    const target = targetInput.value;
    const port = targetPort?.value || 5201;
    let bandwidth = bandwidth_value.value.trim();
    const regex = /^\d+(\.\d+)?[KMG]$/i;
    let protocol = state.protocol
    let mode = state.mode

    if (!regex.test(bandwidth)) bandwidth = "0";
    const streams = parseInt(streamsInput.value);

    resultEl.textContent = "Running iPerf3...";
    console.log(protocol, mode, streams, target, bandwidth, port)

    try {
        const response = await fetch('/run_iperf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ protocol, mode, streams, target, bandwidth, port })
        });

        if (!response.ok) throw new Error('Error starting iPerf3.');

        const eventSource = new EventSource('/stream_iperf');

        eventSource.onmessage = (event) => {
            const avg = state.bandwidthCount > 0 ? (state.bandwidthSum / state.bandwidthCount).toFixed(2) : 0;
            if (event.data === "--- TEST COMPLETED ---") {
                resultEl.textContent += "Test completed successfully.\n";
                eventSource.close();
            } else {
                let bandwidthValue = parseFloat(event.data);
                if (!isNaN(bandwidthValue)) {
                    if (bandwidthValue >= 0) {
                        updateSpeedometer(bandwidthValue);
                        state.bandwidthSum += bandwidthValue;
                        state.bandwidthCount += 1;
                        if (bandwidthValue > state.maxBandwidth) state.maxBandwidth = bandwidthValue;

                        document.querySelector(".status").textContent = "Status: Running";
                        resultEl.textContent += event.data + '\n';
                    } else {
                        document.querySelector(".status").textContent = "Status: Completed";
                        document.querySelector(".avg_speed").textContent = `AVG: ${avg} ${state.units}`;
                        document.querySelector(".max_speed").textContent = `MAX: ${state.maxBandwidth} ${state.units}`;
                    }
                }
            }
        };

        eventSource.onerror = () => {
            resultEl.textContent = "Error occurred while streaming the output.";
            eventSource.close();
        };
    } catch (error) {
        resultEl.textContent = error.message;
    }
});
