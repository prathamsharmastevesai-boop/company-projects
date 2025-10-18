import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={`main-wrapper ${collapsed ? "" : "open"}`}
      style={{ height: "100dvh" }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} className="" />

      <div className="flex-grow-1 content-wrapper">
        <Outlet />
      </div>
    </div>
  );
};
