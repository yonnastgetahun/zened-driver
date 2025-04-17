'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestContextType {
  isGuest: boolean;
  deviceId: string | null;
  guestName: string | null;
  setGuestName: (name: string) => void;
}

const GuestContext = createContext<GuestContextType>({
  isGuest: false,
  deviceId: null,
  guestName: null,
  setGuestName: () => {},
});

export const useGuest = () => useContext(GuestContext);

interface GuestProviderProps {
  children: ReactNode;
}

export function GuestProvider({ children }: GuestProviderProps) {
  const [isGuest, setIsGuest] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is a guest by looking for the guest_info cookie
    try {
      const guestInfoCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('guest_info='));
      
      if (guestInfoCookie) {
        const guestInfo = JSON.parse(decodeURIComponent(guestInfoCookie.split('=')[1]));
        setIsGuest(guestInfo.isGuest || false);
        setDeviceId(guestInfo.deviceId || null);
        
        // Check localStorage for saved guest name
        const savedName = localStorage.getItem('guest_name');
        if (savedName) {
          setGuestName(savedName);
        }
      }
    } catch (error) {
      console.error('Error parsing guest info cookie:', error);
    }
  }, []);
  
  // Save guest name to localStorage when it changes
  const updateGuestName = (name: string) => {
    setGuestName(name);
    localStorage.setItem('guest_name', name);
  };

  const value = {
    isGuest,
    deviceId,
    guestName,
    setGuestName: updateGuestName,
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
} 