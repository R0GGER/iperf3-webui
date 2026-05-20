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

function setMode(activeId, mode) {
    modeBtns.forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
    state.mode = mode;

    if (mode === 'bidir') {
        gaugeSection.style.display = 'none';
        bidirSection.style.display = '';
    } else {
        gaugeSection.style.display = '';
        bidirSection.style.display = 'none';
    }
}

document.getElementById('uploadBtn').addEventListener('click', () => setMode('uploadBtn', 'upload'));
document.getElementById('downloadBtn').addEventListener('click', () => setMode('downloadBtn', 'download'));
document.getElementById('bidirBtn').addEventListener('click', () => setMode('bidirBtn', 'bidir'));

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
