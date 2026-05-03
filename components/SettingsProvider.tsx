"use client";

import { createContext, useContext } from "react";

const SettingsContext = createContext<any>({});

export function SettingsProvider({ children, settings }: { children: React.ReactNode, settings: any }) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
