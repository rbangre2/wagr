"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";

export default function ParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider> {children} </UserProvider>;
}
