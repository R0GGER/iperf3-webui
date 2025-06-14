export function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// export function sendUnitToServer(selectedUnit) {
//     fetch('/set_unit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ unit: selectedUnit })
//     })
//     .then(response => response.json())
//     .then(data => console.log('Server response:', data))
//     .catch(error => console.error('Error sending unit to server:', error));
// }
