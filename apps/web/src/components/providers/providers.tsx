"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CustomQueryClientProvider } from "@/components/providers/query-client";
import { ModalProvider } from "@/components/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthWatcher from "@/components/providers/auth-watcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CustomQueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <AuthWatcher />
        <ModalProvider />
        <Toaster />
      </ThemeProvider>
    </CustomQueryClientProvider>
  );
}
