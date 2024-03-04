"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import { SportsProvider } from "@/contexts/SportContext";

export default function ParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SportsProvider>
      <UserProvider> {children} </UserProvider>{" "}
    </SportsProvider>
  );
}
