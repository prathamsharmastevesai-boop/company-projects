import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const [isChatPage, setIsChatPage] = useState(false);

  useEffect(() => {
    const chatRoutes = [
      "/UserChat",
      "/ChatWithAnyDoc",
      "/ThirdParty",
      "/ColleagueChat",
      "/BuildingChat",
      "/CompsChat",
      "/ComparativeBuildingChat",
      "/TenantInformationChat",
      "/TenantMarket",
      "/geminichat",
    ];

    const isChat = chatRoutes.some((path) =>
      location.pathname.startsWith(path)
    );
    setIsChatPage(isChat);
  }, [location]);

  return (
    <div
      className={`main-wrapper ${collapsed ? "" : "open"} ${
        isChatPage ? "chat-active" : ""
      }`}
      style={{ height: "100dvh" }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-grow-1 content-wrapper ${
          isChatPage ? "chat-body" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};
