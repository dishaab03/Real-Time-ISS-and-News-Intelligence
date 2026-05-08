/**
 * Calculates the distance and speed between two points using the Haversine formula.
 * @param {Object} pos1 - Previous position {lat, lng}
 * @param {Object} pos2 - Current position {lat, lng}
 * @param {number} timeDiffSeconds - Time difference in seconds
 * @returns {number} Speed in km/h
 */
export const calculateSpeed = (pos1, pos2, timeDiffSeconds) => {
  if (!pos1 || !pos2 || timeDiffSeconds <= 0) return 0;

  const R = 6371; // Earth's radius in km
  const toRad = (deg) => deg * (Math.PI / 180);

  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // distance in km

  const speedKmh = (distance / timeDiffSeconds) * 3600;
  return speedKmh;
};

/**
 * Format timestamp to HH:mm:ss
 */
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

/**
 * LocalStorage wrapper with TTL (Time To Live)
 */
export const cache = {
  set: (key, value, ttlMinutes = 15) => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttlMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  get: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  },
};
