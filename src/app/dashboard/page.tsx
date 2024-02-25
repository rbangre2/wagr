"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/games");
  }, [router]);

  return null;
};

export default Dashboard;
