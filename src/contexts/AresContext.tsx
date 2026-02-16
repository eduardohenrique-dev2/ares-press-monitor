import React, { createContext, useContext } from "react";
import { useAresPressSocket } from "@/hooks/useAresPressSocket";
import { useSafeTrack } from "@/hooks/useSafeTrack";

type AresPressReturn = ReturnType<typeof useAresPressSocket>;
type SafeTrackReturn = ReturnType<typeof useSafeTrack>;

type AresContextType = AresPressReturn & { safeTrack: SafeTrackReturn };

const AresContext = createContext<AresContextType | null>(null);

export function AresProvider({ children }: { children: React.ReactNode }) {
  const ares = useAresPressSocket();
  const safeTrack = useSafeTrack(ares.data);
  return <AresContext.Provider value={{ ...ares, safeTrack }}>{children}</AresContext.Provider>;
}

export function useAres(): AresContextType {
  const ctx = useContext(AresContext);
  if (!ctx) throw new Error("useAres must be used within AresProvider");
  return ctx;
}
