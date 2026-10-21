import React, { createContext, useContext, useState, useEffect } from 'react';

const PINCODE_STORAGE_KEY = 'slsh_user_pincode';

// Indian delivery directory for instant estimation
const PINCODE_DIRECTORY = {
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 1, express: true },
  '500081': { city: 'Hyderabad (Hitec City)', state: 'Telangana', days: 1, express: true },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 1, express: true },
  '560034': { city: 'Bengaluru (Koramangala)', state: 'Karnataka', days: 1, express: true },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 2, express: true },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2, express: true },
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2, express: true },
  '520001': { city: 'Vijayawada', state: 'Andhra Pradesh', days: 1, express: true },
  '530001': { city: 'Visakhapatnam', state: 'Andhra Pradesh', days: 1, express: true },
  '506002': { city: 'Warangal', state: 'Telangana', days: 1, express: true },
  '522002': { city: 'Guntur', state: 'Andhra Pradesh', days: 1, express: true },
  '411001': { city: 'Pune', state: 'Maharashtra', days: 2, express: true },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3, express: false },
};

export const QUICK_PINCODES = [
  { pincode: '500001', city: 'Hyderabad', state: 'Telangana' },
  { pincode: '560001', city: 'Bengaluru', state: 'Karnataka' },
  { pincode: '520001', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
  { pincode: '110001', city: 'New Delhi', state: 'Delhi' },
];

function getEstimatedDateString(days) {
  const target = new Date();
  target.setDate(target.getDate() + days);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formatted = target.toLocaleDateString('en-IN', options);
  if (days === 1) {
    return `Tomorrow (${formatted}), by 5:00 PM`;
  }
  return `${formatted}, by 7:00 PM`;
}

function resolvePincode(pincode) {
  const cleanPincode = (pincode || '').toString().trim().replace(/\D/g, '').slice(0, 6);
  const entry = PINCODE_DIRECTORY[cleanPincode];

  if (entry) {
    return {
      pincode: cleanPincode,
      city: entry.city,
      state: entry.state,
      estimatedDelivery: getEstimatedDateString(entry.days),
      isExpressAvailable: entry.express,
      isCodAvailable: true,
      shippingFee: 0,
    };
  }

  // Fallback for valid 6-digit Indian pincode
  if (cleanPincode.length === 6) {
    return {
      pincode: cleanPincode,
      city: 'India Delivery',
      state: 'Standard Region',
      estimatedDelivery: getEstimatedDateString(3),
      isExpressAvailable: false,
      isCodAvailable: true,
      shippingFee: 0,
    };
  }

  // Default fallback
  return {
    pincode: '500001',
    city: 'Hyderabad',
    state: 'Telangana',
    estimatedDelivery: getEstimatedDateString(1),
    isExpressAvailable: true,
    isCodAvailable: true,
    shippingFee: 0,
  };
}

const LocationContext = createContext(undefined);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => resolvePincode('500001'));
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PINCODE_STORAGE_KEY);
      if (stored) {
        setLocation(resolvePincode(stored));
      }
    } catch {
      // ignore local storage errors
    }
  }, []);

  const updatePincode = (pincode) => {
    const clean = (pincode || '').toString().trim().replace(/\D/g, '').slice(0, 6);
    if (clean.length !== 6) {
      return false;
    }
    const resolved = resolvePincode(clean);
    setLocation(resolved);
    try {
      localStorage.setItem(PINCODE_STORAGE_KEY, clean);
    } catch {
      // ignore
    }
    return true;
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isPincodeModalOpen,
        setIsPincodeModalOpen,
        updatePincode,
        quickPincodes: QUICK_PINCODES,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
