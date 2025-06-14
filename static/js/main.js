import './uiHandlers.js';
import './version.js';
import './runTest.js';
import { initializeCSVPicker } from './csvPicker.js';
import { initGauge } from './gauge.js';

window.addEventListener('DOMContentLoaded', () => {
    initializeCSVPicker();
    initGauge();
});