import state from './state.js';

document.getElementById('target').addEventListener('input', () => {
    state.ip = document.getElementById('target').value;
    // console.log('Updated IP:', state.ip);
});

document.getElementById('port').addEventListener('input', () => {
    state.port = document.getElementById('port').value;
    // console.log('Updated port:', state.port);
});

document.getElementById('streams').addEventListener('input', () => {
    state.streams = document.getElementById('streams').value;
    // console.log('Updated streams:', state.streams);
});

document.getElementById('bandwidth').addEventListener('input', () => {
    state.bandwidth = document.getElementById('bandwidth').value;
    // console.log('Updated bandwidth:', state.bandwidth);
});



const modeBtns = ['uploadBtn', 'downloadBtn', 'bidirBtn'];
const gaugeSection = document.getElementById('gauge-section');
const bidirSection = document.getElementById('bidir-section');
const counterSection = document.getElementById('counter-section');
const displayToggleFields = document.querySelectorAll('.display-toggle-field');

const configuredDisplayMode = document.querySelector('main').dataset.displayMode || 'gauge';
state.displayMode = configuredDisplayMode;
state.activeDisplay = 'gauge';

function updateCounterDirection(mode) {
    const label = document.getElementById('counter-direction-label');
    const iconDl = document.getElementById('counter-icon-download');
    const iconUl = document.getElementById('counter-icon-upload');
    if (mode === 'upload') {
        label.textContent = 'Upload';
        iconDl.style.display = 'none';
        iconUl.style.display = '';
    } else {
        label.textContent = 'Download';
        iconDl.style.display = '';
        iconUl.style.display = 'none';
    }
}

function updateDisplayToggleButtons(display) {
    document.querySelectorAll('.display-gauge-btn').forEach(btn =>
        btn.classList.toggle('active', display === 'gauge'));
    document.querySelectorAll('.display-counter-btn').forEach(btn =>
        btn.classList.toggle('active', display === 'counter'));
}

function showSection(display, mode) {
    gaugeSection.style.display = 'none';
    bidirSection.style.display = 'none';
    counterSection.style.display = 'none';
    const showToggle = state.displayMode === 'both' && mode !== 'bidir';

    if (mode === 'bidir') {
        bidirSection.style.display = '';
    } else if (display === 'counter') {
        counterSection.style.display = '';
        updateCounterDirection(mode);
    } else {
        gaugeSection.style.display = '';
    }

    displayToggleFields.forEach(el => el.style.display = showToggle ? '' : 'none');
    updateDisplayToggleButtons(display);
}

function setMode(activeId, mode) {
    modeBtns.forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
    state.mode = mode;
    showSection(state.effectiveDisplay, mode);
}

function setActiveDisplay(display) {
    state.activeDisplay = display;
    showSection(display, state.mode);
}

document.getElementById('uploadBtn').addEventListener('click', () => setMode('uploadBtn', 'upload'));
document.getElementById('downloadBtn').addEventListener('click', () => setMode('downloadBtn', 'download'));
document.getElementById('bidirBtn').addEventListener('click', () => setMode('bidirBtn', 'bidir'));
document.querySelectorAll('.display-gauge-btn').forEach(btn =>
    btn.addEventListener('click', () => setActiveDisplay('gauge')));
document.querySelectorAll('.display-counter-btn').forEach(btn =>
    btn.addEventListener('click', () => setActiveDisplay('counter')));

showSection(state.effectiveDisplay, state.mode);

document.getElementById('tcpBtn').addEventListener('click', () => {
    document.getElementById('tcpBtn').classList.add('active');
    document.getElementById('udpBtn').classList.remove('active');
    state.protocol = 'tcp';
    document.getElementById('bandwidth-field').style.display = 'none';
});

document.getElementById('udpBtn').addEventListener('click', () => {
    document.getElementById('udpBtn').classList.add('active');
    document.getElementById('tcpBtn').classList.remove('active');
    state.protocol = 'udp';
    document.getElementById('bandwidth-field').style.display = '';
});

['Kbits', 'Mbits', 'Gbits'].forEach(unit => {
    document.getElementById(unit).addEventListener('click', () => {
        ['Kbits', 'Mbits', 'Gbits'].forEach(u => document.getElementById(u).classList.remove('active'));
        document.getElementById(unit).classList.add('active');

        state.units = unit.replace('bits', 'bps');
        document.querySelectorAll(".units").forEach(el => el.textContent = unit.replace('bits', 'bps'));
        console.log(`Selected units: ${state.units.replace('bits', 'bps')}`);
    });
});
