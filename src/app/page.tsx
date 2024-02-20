"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box } from "@mui/material";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/signup");
  }, [router]);
  return <Box />;
}
