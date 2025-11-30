'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type LocationContextValue = {
  location: string;
  setLocation: (value: string) => void;
};

interface AdminInfo {
  name?: string;
  description?: string;
}

interface LocalityInfo {
  administrative?: AdminInfo[];
}

interface BigDataCloudResponse {
  principalSubdivision?: string;
  localityInfo?: LocalityInfo;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<string>('United States');

  // Helper to extract state from BigDataCloud response
  const extractState = (data: BigDataCloudResponse): string | undefined => {
    if (typeof data?.principalSubdivision === 'string' && data.principalSubdivision.trim()) {
      return data.principalSubdivision.trim();
    }
    const adminList = Array.isArray(data?.localityInfo?.administrative)
      ? data.localityInfo.administrative
      : [];
    const region = adminList.find((a: AdminInfo) => /region|state|province/i.test(String(a?.description) || ''));
    if (region?.name && typeof region.name === 'string') return region.name.trim();
    return undefined;
  };

  // Resolve user location once and share via context
  useEffect(() => {
    const run = async () => {
      if (typeof window === 'undefined' || !navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
            );
            if (!res.ok) return;

            const data: BigDataCloudResponse = await res.json();
            const currentState = extractState(data);
            if (currentState) setLocation(currentState);
          } catch {
            // ignore network errors; keep default
          }
        },
        () => {
          // denied or error; keep default
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    };

    run();
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


