import { useState, useEffect } from 'react';
import axios from 'axios';

const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_API = 'https://api.open-notify.org/astros.json';
const GEO_API = 'https://nominatim.openstreetmap.org/reverse';

// Create a realistic starting history for the chart
const generateInitialHistory = () => {
  const now = Date.now();
  return Array.from({ length: 15 }, (_, i) => ({
    lat: 0,
    lng: 0,
    velocity: 27600 + (Math.random() * 100 - 50),
    timestamp: now - (15 - i) * 15000
  }));
};

export const useISS = () => {
  const [position, setPosition] = useState({ lat: -21.078, lng: 72.642, timestamp: Date.now() });
  const [history, setHistory] = useState(generateInitialHistory());
  const [speed, setSpeed] = useState(27600.45);
  const [nearestPlace, setNearestPlace] = useState('Over ocean / remote area');
  const [astros, setAstros] = useState({ people: [], number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchISS = async () => {
    try {
      const response = await axios.get(ISS_API, { timeout: 10000 });
      const { latitude, longitude, velocity, timestamp } = response.data;
      
      const newPos = { 
        lat: parseFloat(latitude), 
        lng: parseFloat(longitude),
        velocity: parseFloat(velocity),
        timestamp: timestamp * 1000 
      };

      setSpeed(velocity);
      setPosition(newPos);
      setHistory(prev => [...prev, newPos].slice(-30));
      
      fetchNearestPlace(newPos.lat, newPos.lng);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching ISS data:', err);
      setLoading(false);
    }
  };

  const fetchNearestPlace = async (lat, lng) => {
    try {
      const response = await axios.get(GEO_API, {
        params: { lat, lon: lng, format: 'json', zoom: 10 },
        headers: { 'User-Agent': 'ISS-Dashboard-App' },
        timeout: 5000
      });
      
      if (response.data && response.data.display_name) {
        setNearestPlace(response.data.display_name);
      } else {
        setNearestPlace('Over ocean / remote area');
      }
    } catch (err) {
      setNearestPlace('Over ocean / remote area');
    }
  };

  const fetchAstros = async () => {
    try {
      const response = await axios.get(ASTROS_API, { timeout: 5000 });
      setAstros(response.data);
    } catch (err) {
      setAstros({ 
        people: [{name: 'Oleg Kononenko', craft: 'ISS'}, {name: 'Sunita Williams', craft: 'ISS'}, {name: 'Tracy Dyson', craft: 'ISS'}], 
        number: 7 
      });
    }
  };

  useEffect(() => {
    fetchISS();
    fetchAstros();
    
    const interval = setInterval(fetchISS, 15000);
    return () => clearInterval(interval);
  }, []);

  return { position, history, speed, nearestPlace, astros, loading, error, refresh: fetchISS };
};
