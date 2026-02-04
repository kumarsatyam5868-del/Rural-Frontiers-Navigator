// 1. Initialize the "Edge" Map
const map = L.map('map', { zoomControl: false }).setView([27.0330, 75.8350], 13);
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

let userPoints = [];
let activeRoute = null;

// 2. Rural Trail "Memory" (Simulating the 50MB Offline Map Pack)
// In a real app, this data comes from your Python packager.
const ruralTrails = [
    [27.0330, 75.8350], [27.0350, 75.8380], [27.0400, 75.8400], 
    [27.0450, 75.8350], [27.0500, 75.8300], [27.0550, 75.8350],
    [27.0600, 75.8450], [26.9239, 75.8267]
];

// 3. User Interaction Logic
map.on('click', function(e) {
    if (userPoints.length >= 2) {
        clearMap();
    }

    const marker = L.marker(e.latlng).addTo(map);
    userPoints.push(e.latlng);

    if (userPoints.length === 2) {
        generateRuralDirections();
    }
});

function generateRuralDirections() {
    const start = userPoints[0];
    const end = userPoints[1];
    
    // SIMULATING THE "BRAIN" (GraphHopper Engine) [cite: 31, 46]
    // We create a path that "snaps" to the nearest rural trails
    const path = [
        [start.lat, start.lng],
        ...ruralTrails.filter(pt => pt[0] > Math.min(start.lat, end.lat) && pt[0] < Math.max(start.lat, end.lat)),
        [end.lat, end.lng]
    ];

    // Render the Rural Path (Green)
    activeRoute = L.polyline(path, {
        color: '#2ecc71',
        weight: 6,
        opacity: 0.9,
        dashArray: '10, 10'
    }).addTo(map);

    calculateRuralImpact(start, end, path);
}

function calculateRuralImpact(start, end, path) {
    // 1. Calculate Actual Distance (Rural Trail)
    let ruralDist = 0;
    for(let i=0; i < path.length-1; i++) {
        ruralDist += L.latLng(path[i]).distanceTo(L.latLng(path[i+1]));
    }
    const ruralKm = (ruralDist / 1000).toFixed(2);

    // 2. Compare to Standard OSM Highway (Simulated as 25% longer for rural areas) 
    const osmKm = (ruralKm * 1.25).toFixed(2);
    
    // 3. Calculate Fuel Savings (1.5L per week avg / 7 days) 
    const fuelSaved = ( (osmKm - ruralKm) * 0.05).toFixed(2); 

    // Update the UI Dashboard
    document.getElementById('status-update').innerHTML = `
        <b>DISTANCE:</b> ${ruralKm} km <br>
        <b>VS OSM:</b> <span style="color:#e74c3c">${osmKm} km</span><br>
        <b>FUEL SAVED:</b> ${fuelSaved} L
    `;
    
    map.fitBounds(activeRoute.getBounds(), {padding: [50, 50]});
}

function clearMap() {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    userPoints = [];
    document.getElementById('status-update').innerText = "Select two points for Rural Route";
}