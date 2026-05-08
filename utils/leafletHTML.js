const lat = 14.673413900535;
const lng = 120.9685888671883;
const zoom = 17;

export const maxBounds = [
  [14.616796295409431, 120.90597134427183],
  [14.718980127971527, 121.00881300073651],
];
const getLeafletHTML = () => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', { 
      zoomControl: false, 
      renderer: L.canvas({ tolerance: 5 }),  
      zoom: 17,
      maxZoom: 17,
      minZoom: 15,
      maxBounds: ${JSON.stringify(maxBounds)},  
      maxBoundsViscosity: 1.0,   }).setView([${lat}, ${lng}], ${zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 15,
      detectRetina: true, 
    }).addTo(map);
    
    map.on('click', function(e) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng })
      );
    });
  </script>
</body>
</html>
`;

export default getLeafletHTML;
