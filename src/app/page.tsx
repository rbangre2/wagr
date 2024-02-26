"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

const App = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/signup");
  }, [router]);

  return <Box />;
};

export default App;
