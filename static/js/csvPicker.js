const csvUrl = "/proxy/iperf3-csv"; 
let csvData = [];

async function fetchAndParseCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  const rows = text.trim().split("\n").map(row => row.split(","));
  return rows;
}

function showPopup() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function hidePopup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popup").style.display = "none";
}

function populateTable(data) {
  const thead = document.querySelector("#csvTable thead");
  const tbody = document.querySelector("#csvTable tbody");
  thead.innerHTML = "";
  tbody.innerHTML = "";

  const headers = data[0];
  const rows = data.slice(1);

  const headerRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tr.addEventListener("click", () => {
      const selected = headers.map((h, i) => `${h}: ${row[i]}`).join("<br>");
      const selectedDiv = document.getElementById("selectedServer");
      selectedDiv.innerHTML = selected;
      selectedDiv.style.display = "block";
      hidePopup();
    });
    tbody.appendChild(tr);
  });
}

function filterTable(query) {
  const tbody = document.querySelector("#csvTable tbody");
  const rows = tbody.querySelectorAll("tr");
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query.toLowerCase()) ? "" : "none";
  });
}

function initializeCSVPicker() {
  const openBtn = document.getElementById("openPopupBtn");
  const searchInput = document.getElementById("searchInput");
  const overlay = document.getElementById("overlay");

  if (!openBtn || !searchInput || !overlay) {
    console.warn("CSV Picker: Required elements are missing in HTML.");
    return;
  }

  openBtn.addEventListener("click", async () => {
    if (csvData.length === 0) {
      csvData = await fetchAndParseCSV(csvUrl);
    }
    populateTable(csvData);
    showPopup();
  });

  searchInput.addEventListener("input", (e) => {
    filterTable(e.target.value);
  });

  overlay.addEventListener("click", hidePopup);
}

// Export the init function
export { initializeCSVPicker };
