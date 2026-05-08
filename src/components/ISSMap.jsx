import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});

function MapController({ position }) {
  const map = useMap();
  useEffect(() => {
    const timer = setInterval(() => map.invalidateSize(), 500);
    return () => clearInterval(timer);
  }, [map]);

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

const ISSMap = ({ position, history }) => {
  // Use a unique key to force remount if needed, but MapController handles position
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    if (position) setHasRendered(true);
  }, [position]);

  if (!hasRendered) return <div style={{ height: '100%', background: '#fdfaf5' }}></div>;

  const pathPositions = (history || []).map(p => [p.lat, p.lng]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pathPositions.length > 1 && (
          <Polyline positions={pathPositions} pathOptions={{ color: '#ef4444', weight: 2 }} />
        )}
        <Marker position={[position.lat, position.lng]} icon={issIcon}>
          <Popup>ISS Location</Popup>
        </Marker>
        <MapController position={position} />
      </MapContainer>
    </div>
  );
};

export default ISSMap;
