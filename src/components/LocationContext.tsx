'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type LocationContextValue = {
  location: string;
  setLocation: (value: string) => void;
};

// Unused types removed

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<string>('United States');

  // Default to United States, no geolocation
  useEffect(() => {
    setLocation('United States');
  }, []);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationValue() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationValue must be used within a LocationProvider');
  return ctx;
}


