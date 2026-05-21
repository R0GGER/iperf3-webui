import state from './state.js';
import { initGauge, updateGauge } from './gauge.js';

const runBtn = document.getElementById('runBtn');
const resultEl = document.getElementById('result');

function resetBidirDisplay() {
    document.getElementById('bidir-download-value').textContent = '0';
    document.getElementById('bidir-upload-value').textContent = '0';
    document.querySelectorAll('.bidir-avg-download').forEach(el => el.textContent = '--');
    document.querySelectorAll('.bidir-avg-upload').forEach(el => el.textContent = '--');
}

function resetCounterDisplay() {
    document.getElementById('counter-value').textContent = '0';
    document.querySelectorAll('.avg_speed').forEach(el => el.textContent = '--');
    document.querySelectorAll('.max_speed').forEach(el => el.textContent = '--');
}

function handleBidirData(event, units) {
    const data = event.data;

    if (parseFloat(data) < 0) {
        document.querySelectorAll(".status").forEach(el => el.textContent = "Complete");

        const avgDl = state.bidirDownloadCount > 0
            ? (state.bidirDownloadSum / state.bidirDownloadCount).toFixed(2) : '--';
        const avgUl = state.bidirUploadCount > 0
            ? (state.bidirUploadSum / state.bidirUploadCount).toFixed(2) : '--';

        document.querySelectorAll('.bidir-avg-download').forEach(el => el.textContent = `${avgDl} ${units}`);
        document.querySelectorAll('.bidir-avg-upload').forEach(el => el.textContent = `${avgUl} ${units}`);
        return 'close';
    }

    if (data === "server is busy") {
        document.querySelectorAll(".status").forEach(el => el.textContent = "Server is Busy");
        return;
    }

    if (data.startsWith('bidir_download:')) {
        const val = parseFloat(data.split(':')[1]);
        if (!isNaN(val)) {
            document.getElementById('bidir-download-value').textContent = val.toFixed(2);
            state.bidirDownloadSum += val;
            state.bidirDownloadCount += 1;
            document.querySelectorAll(".status").forEach(el => el.textContent = "Running");
            resultEl.textContent += `DL: ${val.toFixed(2)} ${units}\n`;
        }
    } else if (data.startsWith('bidir_upload:')) {
        const val = parseFloat(data.split(':')[1]);
        if (!isNaN(val)) {
            document.getElementById('bidir-upload-value').textContent = val.toFixed(2);
            state.bidirUploadSum += val;
            state.bidirUploadCount += 1;
            document.querySelectorAll(".status").forEach(el => el.textContent = "Running");
            resultEl.textContent += `UL: ${val.toFixed(2)} ${units}\n`;
        }
    }
}

function handleNormalData(event, units) {
    const data = event.data;

    const isCounter = state.effectiveDisplay === 'counter';

    if (parseFloat(data) < 0) {
        const avg = state.bandwidthCount > 0 ? (state.bandwidthSum / state.bandwidthCount).toFixed(2) : '--';
        document.querySelectorAll(".status").forEach(el => el.textContent = "Complete");
        document.querySelectorAll(".avg_speed").forEach(el => el.textContent = `${avg} ${units}`);
        document.querySelectorAll(".max_speed").forEach(el => el.textContent = `${state.maxBandwidth.toFixed(2)} ${units}`);
        return 'close';
    }

    if (data === "--- TEST COMPLETED ---") {
        resultEl.textContent += "Test completed successfully.\n";
        return 'close';
    }

    if (data === "server is busy") {
        document.querySelectorAll(".status").forEach(el => el.textContent = "Server is Busy");
        return;
    }

    let bandwidthValue = parseFloat(data);
    if (!isNaN(bandwidthValue) && bandwidthValue >= 0) {
        if (isCounter) {
            document.getElementById('counter-value').textContent = bandwidthValue.toFixed(2);
        } else {
            updateGauge(bandwidthValue);
        }
        state.bandwidthSum += bandwidthValue;
        state.bandwidthCount += 1;
        if (bandwidthValue > state.maxBandwidth) state.maxBandwidth = bandwidthValue;

        document.querySelectorAll(".status").forEach(el => el.textContent = "Running");
        resultEl.textContent += data + '\n';
    }
}

runBtn.addEventListener('click', async () => {
    const target = state.ip;
    const port = state.port;
    const streams = state.streams;
    let bandwidth = state.bandwidth.trim();
    const protocol = state.protocol;
    const mode = state.mode;
    const units = state.units;

    const regex = /^\d+(\.\d+)?[KMG]$/i;
    if (!regex.test(bandwidth)) bandwidth = "0";

    resultEl.textContent = "Running iPerf3...\n";
    state.resetStats();

    if (mode === 'bidir') {
        resetBidirDisplay();
    } else if (state.effectiveDisplay === 'counter') {
        resetCounterDisplay();
    } else {
        initGauge();
    }

    try {
        const response = await fetch('/run_iperf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ protocol, mode, streams, target, bandwidth, port, units })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error starting iPerf3.');
        }

        let eventSource = new EventSource('/stream_iperf');

        eventSource.onmessage = (event) => {
            const result = mode === 'bidir'
                ? handleBidirData(event, units)
                : handleNormalData(event, units);

            if (result === 'close') {
                eventSource.close();
            }
        };

        eventSource.onerror = (error) => {
            console.error("Stream error:", error);
            resultEl.textContent = "Error occurred while streaming the output.";
            eventSource.close();
        };
    } catch (error) {
        console.error("Stream error:", error);
        resultEl.textContent = error.message;
    }
});
