"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { SettingsProvider } from "./SettingsProvider";

export function Providers({ children, settings }: { children: React.ReactNode, settings: any }) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsProvider settings={settings}>
          <Toaster position="top-center" />
          {children}
        </SettingsProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
