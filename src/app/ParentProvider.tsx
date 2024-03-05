"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function ParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider> {children} </UserProvider>
    </QueryClientProvider>
  );
}
