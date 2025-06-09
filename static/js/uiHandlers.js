import state from './state.js';
import { sendUnitToServer } from './utils.js';

document.getElementById('uploadBtn').addEventListener('click', () => {
    document.getElementById('uploadBtn').classList.add('active');
    document.getElementById('downloadBtn').classList.remove('active');
    state.mode = 'upload';
    console.log('Selected mode: Upload');
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    document.getElementById('downloadBtn').classList.add('active');
    document.getElementById('uploadBtn').classList.remove('active');
    state.mode = 'download';
    console.log('Selected mode: Download');
});

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

        state.units = unit;
        document.querySelector(".units").textContent = unit.replace('bits', 'bps');
        sendUnitToServer(state.units);
        console.log(`Selected units: ${state.units}`);
    });
});
