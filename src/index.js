import 'leaflet/dist/leaflet.css';
import './style.css';
import {
  map as makeMap,
  tileLayer,
  marker,
  polyline as makePolyline,
  icon,
} from 'leaflet';

function errorToText(err) {
  const codeToText = {
    1: 'PERMISSION_DENIED',
    2: 'POSITION_UNAVAILABLE',
    3: 'TIMEOUT',
  }
  return JSON.stringify({ code: codeToText[err.code], message: err.message });
}

function watchGPS(positionCallback) {
  if (!('geolocation' in navigator)) {
    alert('GPS API is not supported');
    return;
  }
  const watchId = navigator.geolocation.watchPosition(
    positionCallback,
    (err) => {
      alert(errorToText(err));
    },
    { enableHighAccuracy: false },
  );
  return () => {
    navigator.geolocation.clearWatch(watchId);
  }
}

const ACCESS_TOKEN = 'pk.eyJ1Ijoia3JhZnR3ZXJrMjgiLCJhIjoiY2tsdW9vYzBiMDJobzJ' +
  'wbzY1NzBjYzVhcyJ9.FaXMXcrTOwsDKuYnxt1PzA';

async function queryPermissions() {
  if (!('permissions' in navigator)) {
    throw Error('navigator.permissions not supported');
  }
  const result = await navigator.permissions.query({ name: 'geolocation' });
  if (result.state !== 'granted') {
    throw Error('No permissions for `geolocation`');
  }
}

async function main() {
  try {
    await queryPermissions();
  } catch (err) {
    alert(err);
    return;
  }
  const map = makeMap(document.querySelector('#map')).setView([48.7, 32.7], 16);
  const layer = tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}' +
    '?access_token={accessToken}',
    { maxZoom: 22, tileSize: 512, zoomOffset: -1, accessToken: ACCESS_TOKEN },
  );
  const posMarker = marker(map.getCenter());
  const polyline = makePolyline([]);

  layer.addTo(map);
  posMarker.addTo(map);
  polyline.addTo(map);

  watchGPS(({ coords, timestamp }) => {
    const { latitude, longitude, accuracy, speed } = coords;
    const latLng = [latitude, longitude];
    posMarker.setLatLng(latLng);
    polyline.addLatLng(latLng);
    // marker(latLng, { opacity: 1})
    //   .bindTooltip(accuracy.toFixed(2).toString())
    //   .openTooltip()
    //   .addTo(map);
  });
}

main();
