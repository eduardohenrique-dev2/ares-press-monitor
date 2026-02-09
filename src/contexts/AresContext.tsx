import React, { createContext, useContext } from "react";
import { useAresPressSocket } from "@/hooks/useAresPressSocket";

type AresContextType = ReturnType<typeof useAresPressSocket>;

const AresContext = createContext<AresContextType | null>(null);

export function AresProvider({ children }: { children: React.ReactNode }) {
  const ares = useAresPressSocket();
  return <AresContext.Provider value={ares}>{children}</AresContext.Provider>;
}

export function useAres(): AresContextType {
  const ctx = useContext(AresContext);
  if (!ctx) throw new Error("useAres must be used within AresProvider");
  return ctx;
}
