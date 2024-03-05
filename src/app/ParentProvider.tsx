"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import { SportsProvider } from "@/contexts/SportContext";
import { BetProvider } from "@/contexts/BetContext";

export default function ParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BetProvider>
      <SportsProvider>
        <UserProvider> {children} </UserProvider>
      </SportsProvider>
    </BetProvider>
  );
}
