// speedometer.js
import state from './state.js';

const canvas = document.getElementById('speedometer');
const ctx = canvas.getContext('2d');
const currentValueElement = document.getElementById('current-value');

const canvasSize = Math.min(window.innerWidth * 0.8, 400);
canvas.width = canvasSize;
canvas.height = canvasSize;

let maxValue = 0;
const arcLength = Math.PI;
let previousValue = 0;
const animationSpeed = 0.05;

function getCSSVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, getCSSVariable('--speedometer_gradient_1'));
gradient.addColorStop(0.5, getCSSVariable('--speedometer_gradient_2'));
gradient.addColorStop(1, getCSSVariable('--speedometer_gradient_3'));

function drawSpeedometer(value) {
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(canvasSize / 2, canvasSize / 2, 140, startAngle, endAngle);
  ctx.lineWidth = 30;
  ctx.strokeStyle = '#232f4e';
  ctx.stroke();

  // Foreground arc (speed)
  const angle = startAngle + (value / maxValue) * arcLength;
  ctx.beginPath();
  ctx.arc(canvasSize / 2, canvasSize / 2, 140, startAngle, angle);
  ctx.lineWidth = 30;
  ctx.strokeStyle = gradient;
  ctx.stroke();

  drawMarkers(startAngle, endAngle);
  drawNeedle(value);
}

function generateBreakdownList(maxValue, numSteps) {
  const list = [];
  numSteps -= 1;
  if (numSteps <= 0 || maxValue <= 0) return list;

  let rawStep = maxValue / numSteps;
  let magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  let niceStep = Math.ceil(rawStep / magnitude) * magnitude;
  let adjustedMax = niceStep * numSteps;

  for (let i = 0; i <= numSteps; i++) {
    let val = i * niceStep;
    list.push(adjustedMax < 10 ? parseFloat(val.toFixed(1)) : Math.round(val));
  }

  return list;
}

function drawMarkers(startAngle, endAngle) {
  const values = generateBreakdownList(maxValue, 5);
  const radius = 100;

  ctx.font = '16px Montserrat';
  ctx.fillStyle = getCSSVariable('--text');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  values.forEach((val, idx) => {
    const angle = startAngle + (val / maxValue) * (endAngle - startAngle);
    let x = canvasSize / 2 + Math.cos(angle) * radius;
    let y = canvasSize / 2 + Math.sin(angle) * radius;

    if (idx === 0 || idx === values.length - 1) {
      y -= 16; // adjust this value as needed
    }

    ctx.fillText(val.toFixed(1), x, y);
  });
}

function drawNeedle(value) {
  const startAngle = (3 * Math.PI) / 2;
  const angle = startAngle + (value / maxValue) * arcLength;

  ctx.save();
  ctx.translate(canvasSize / 2, canvasSize / 2);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -90);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#141526';
  ctx.stroke();
  ctx.restore();
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function animateNeedle(start, end, callback) {
  function step(current) {
    const value = lerp(current, end, animationSpeed);
    drawSpeedometer(value);
    if (Math.abs(value - end) > 0.01) {
      requestAnimationFrame(() => step(value));
    } else {
      drawSpeedometer(end);
      if (callback) callback();
    }
  }
  step(start);
}

function updateSpeedometer(value) {
  if (value > maxValue * 0.8) {
    maxValue = value + value * 0.2;
  }
  animateNeedle(previousValue, value);
  previousValue = value;
  currentValueElement.innerText = value.toFixed(2);
}

export { updateSpeedometer };
