fetch('/iperf_version')
    .then(response => response.json())
    .then(data => {
        document.getElementById('iperf_version').textContent = data.version;
    })
    .catch(() => {
        document.getElementById('iperf_version').textContent = 'Error fetching version';
    });
