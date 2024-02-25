import React, { ReactNode } from "react";
import SportsBar from "@/components/SportsBar/SportsBar";
import DashboardLayout from "@/app/dashboard/DashboardLayout";

interface GamesLayoutProps {
  children: ReactNode;
}

const GamesLayout: React.FC<GamesLayoutProps> = ({ children }) => {
  return (
    <DashboardLayout>
      <SportsBar />
      <div>{children}</div>
    </DashboardLayout>
  );
};

export default GamesLayout;
