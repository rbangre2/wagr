"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Games = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/games/soccer");
  }, [router]);

  return null;
};

export default Games;
