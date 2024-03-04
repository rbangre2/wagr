"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

import styles from "./page.module.css"

const Games = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/games/soccer");
  }, [router]);

  return (
    <Box className={styles.background} />
  );
};

export default Games;
