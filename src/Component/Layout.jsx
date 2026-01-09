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
      "/TenantInformation",
      "/TenantMarket",
      "/geminichat",
      "/ReportChat",
      "/portfolio-forum",
      "/dashboard",
      "/EmailDrafting",
      "/notes",
      "/LeaseAbstractUpload1",
      "/InformationCollaborationPage",
      "/benchmark",
      "/distilledcomptrackerpage",
      "/calculator",
      "/UserBuildingInfolist",
      "/ComparativeUserBuildinglist",
      "/ComparativeBuildingData",
      "/tenentInfoUserBuildinglist",
      "/SubleaseTrackerBuildinglist",
      "/subleaseTracker",
      "/renewalTrackerList",
      "/renewalTracker",
      "/UserBuildinglist",
      "/Tours",
      "/dealList",
      "/UserProfile",
      "/history",
      "/SelectUserBuildingCategory",
      "/UserLease",
      "/CreNews",
      //Admin Routes
      "/AdminDashboard",
      "/UserManagement",
      "/Aianalytics",
      "/RagSystem",
      "/PortfolioVoice",
      "/admin-portfolio-forum",
      "/LeaseDraftingUpload",
      "/adminInformationCollaboration",
      "/distilledExpenseTrackerPage",
      "/destilledcomptracker",
      "/space-inquiry",
      "/Thirdparty",
      "/EmployContact",
      "/Comps",
      "/ComparativeBuildingList",
      "/TenentInfoBuildingList",
      "/TenantsMarket",
      "/BuildingInfoList",
      "/Select_Building_Category",
      "/subleaseTrackerList",
      "/renewalTrackerbuildingList",
      "/toursDetails",
      "/Building_list",
      "/LeaseList",
      "/LeaseInfo",
      "/BuildingInfo",
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
