import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Networking/Admin/Store/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DashboardLayout } from "./Component/Layout";
import { UserAccess } from "./Pages/Admin/UserAccess";
import { CreateBuilding } from "./Pages/Admin/Building/CreateBuilding";
import { ListBuilding } from "./Pages/Admin/Building/Buildlist";
import { LeaseInfomation } from "./Pages/Admin/Lease/leasesInfo";
import { UpdateBuilding } from "./Pages/Admin/Building/EditBuilding";
import { CreateLease } from "./Pages/Admin/Lease/CreateLease";
import { LeaseList } from "./Pages/Admin/Lease/Leaselist";
import { UpdateLease } from "./Pages/Admin/Lease/EditLease";
import ProtectedRoute from "./Route/ProtectedRoute";
import { useEffect } from "react";
import { SignUp } from "../src/Pages/User/Auth/SignUp";
import { AdminLogin } from "../src/Pages/Admin/Auth/AdminLogin";
import { VerifyOtp } from "../src/Pages/User/Auth/VerifyOTP";
import { Dashboard } from "../src/Pages/User/Dashboard/Dashboard";
import { Login } from "../src/Pages/User/Auth/Login";
import { UserBuildinglist } from "./Pages/User/Building/UserBuildinglist";
import { UserLeaseList } from "./Pages/User/Lease/UserLeaselist";
import { UserProfile } from "./Pages/User/Profile/UserProfile";
import { UserChat } from "./Pages/User/Chat/ChatUser";
import { ChatWithAnyDoc } from "./Pages/User/Chat/ChatwithAny";
import BuildingPdfUploader from "./Pages/Admin/Building/BuildingGenInfo";
import { ForgotPassword } from "./Pages/User/Auth/ForgetPassword";
import { ResetPassword } from "./Pages/User/Auth/ResetPassword";
import { Approved_Denied_list } from "./Pages/Admin/Approved_Denied_list";
import { Home } from "./Pages/Home";
import GeneralInfoupload from "./Pages/Admin/GeneralInfo/GeneralInfoUpload";
import { BrokerChat } from "./Pages/User/Broker/Broker";
import { ColleagueChat } from "./Pages/User/Colleague/Colleague";
import { BuildingChat } from "./Pages/User/BuildingChat/BuildingChat";
import { MarketChat } from "./Pages/User/Market/Market";
import { AdminDashboard } from "./Pages/Admin/DashBoard/AdminDashboard";
import { UserManagement } from "./Pages/Admin/UserManagement/UserManagement";
import { RagSystem } from "./Pages/Admin/RagSystem/RagSystem";
import { PortfolioVoice } from "./Pages/Admin/PortfolioVoice/PortfolioVoice";
import { Thirdparty } from "./Pages/Admin/GeneralInfo/Thirdparty";
import { EmployContact } from "./Pages/Admin/GeneralInfo/EmployContact";
import { MarketIntelligence } from "./Pages/Admin/GeneralInfo/MarketIntelligence";
import { BuildingInfo } from "./Pages/Admin/GeneralInfo/BuildingInfo";
import { Aianalytics } from "./Pages/Admin/AIanalytics/AiAnaylistics";
import { SessionList } from "./Pages/User/Session/sessionList";
import { LeaseAbstractUpload } from "./Pages/Admin/LeaseAbstract/LeaseAbstractUpload";
import { AdminManagement } from "./Pages/SuperAdmin/AdminManagement/AdminManagement";
import { ComparativeBuildingData } from "./Pages/Admin/ComparativeBuilding/comparetiveBuilding";
import { ComparativeBuildingChat } from "./Pages/User/ComparativeBuilding/comparativeBuilding";

import { TenantMarket } from "./Pages/User/TenantMarket/tenantMarket";
import { TenantMarketUpload } from "./Pages/Admin/GeneralInfo/TenantMarket";
import { TenantInformation } from "./Pages/User/TenantInformation/tenantInformationChat";
import { TenantInformationUpload } from "./Pages/Admin/GeneralInfo/TenantInformation";
import { LeaseDraftingUpload } from "./Pages/Admin/LeaseDrafting/leaseDrafting";
import { SummeryUpload } from "./Pages/User/ReportSummery/reportsummarizer";
import { EmailDrafting } from "./Pages/User/EmailDrafting/emailDrafting";
import { GeminiChat } from "./Pages/User/GeminiChat/geminiChat";
import { ChatWindow } from "./Component/ChatWindow";
import { ReportChat } from "./Pages/User/ReportSummery/ReportChat";
import { Tours } from "./Pages/User/TourPage/Tours/tours";
import { ToursDetails } from "./Pages/User/TourPage/ToursDetails/toursDetails";
import { ToursPage } from "./Pages/User/TourPage/toursPage";
import { PortfolioForum } from "./Pages/User/Forum/forum";
import { CreateThread } from "./Pages/User/Forum/createThread";
import { ComparativeBuildingList } from "./Pages/Admin/ComparativeBuilding/comparativeBuildinglist";
import { BuildingInfoList } from "./Pages/Admin/GeneralInfo/BuildingInfoList";
import { ComparativeUserBuildinglist } from "./Pages/User/ComparativeBuilding/comparativeUserBuildinglist";
import { UserBuildingInfolist } from "./Pages/User/BuildingChat/userBuildingInfoList";
import { LeaseFinanceCalculator } from "./Pages/User/Calc/calculator";
import { InformationCollaborationPage } from "./Pages/User/InformationCollaboration/informationCollaborationpages";
import { TenentInfoUserBuildinglist } from "./Pages/User/TenantInformation/tenentInformationList";
import { TenentInfoBuildingList } from "./Pages/Admin/GeneralInfo/tenentInformationList";
import { Benchmark } from "./Pages/User/DistilledExpenseTracker/benchmark";
import { DistilledExpenseTracker } from "./Pages/Admin/DistilledExpenseTracker/distilledExpenseTracker";
import { DistilledExpenseTrackerPage } from "./Pages/Admin/DistilledExpenseTracker/distilledExpenseTrackerpage";
import { SubleaseTrackerList } from "./Pages/Admin/SubleaseTracker/subleaseTrackerList";
import { SubleaseTracker } from "./Pages/Admin/SubleaseTracker/subleaseTracker";
import { Notes } from "./Pages/User/Notes/notes";
import { SubleaseTrackerChat } from "./Pages/User/SubleaseTracker/subleaseTrackerChat";

import { SpaceInquiry } from "./Pages/Admin/SpaceInquiry/spaceInquiry";
import DealList from "./Pages/User/DealTracker/dealList";
import DealDetailView from "./Pages/User/DealTracker/dealDetailView";
import DealForm from "./Pages/User/DealTracker/dealForm";
import { RenewalTrackerList } from "./Pages/User/RenewalTracker/renewalTrackerList";
import { RenewalTracker } from "./Pages/User/RenewalTracker/renewalTracker";
import { CalulatorPage } from "./Pages/User/Calc/calculatorPage";
import { AdminInformationCollaboration } from "./Pages/Admin/InformationCollaboration/adminInformationCollaboration";
import { InformationCollaboration } from "./Pages/User/InformationCollaboration/InformationCollaboration";
import { SelectBuildingCategory } from "./Pages/Admin/Building/selectBuildingCategory";
import { SelectUserBuildingCategory } from "./Pages/User/BuildingChat/selectBuildingCategory";
import { CreNews } from "./Pages/User/CreNews/creNews";

function App() {
  useEffect(() => {
    const expiry = sessionStorage.getItem("tokenExpiry");

    if (expiry && Date.now() > parseInt(expiry)) {
      toast.warning("Your session has expired.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("tokenExpiry");
      window.location.href = "/#/";
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/VerifyOtp" element={<VerifyOtp />} />
          <Route path="/Admin" element={<AdminLogin />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["superuser"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/AdminManagement" element={<AdminManagement />} />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/AdminDashboard" element={<AdminDashboard />} />

            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/Aianalytics" element={<Aianalytics />} />
            <Route path="/RagSystem" element={<RagSystem />} />
            <Route path="/PortfolioVoice" element={<PortfolioVoice />} />
            <Route
              path="/LeaseAbstractUpload"
              element={<LeaseAbstractUpload />}
            />

            <Route
              path="/LeaseDraftingUpload"
              element={<LeaseDraftingUpload />}
            />

            <Route path="/Thirdparty" element={<Thirdparty />} />
            <Route path="/EmployContact" element={<EmployContact />} />
            <Route path="/Comps" element={<MarketIntelligence />} />
            <Route path="/TenantsMarket" element={<TenantMarketUpload />} />
            <Route path="/BuildingInfo" element={<BuildingInfo />} />
            <Route path="/BuildingInfoList" element={<BuildingInfoList />} />
            <Route
              path="/TenantInformation"
              element={<TenantInformationUpload />}
            />
            <Route
              path="/TenentInfoBuildingList"
              element={<TenentInfoBuildingList />}
            />
            <Route path="/toursDetails" element={<ToursDetails />} />
            <Route path="/CreateBuilding" element={<CreateBuilding />} />
            <Route path="/Building_list" element={<ListBuilding />} />
            <Route
              path="/Select_Building_Category"
              element={<SelectBuildingCategory />}
            />

            <Route path="/UpdateBuilding" element={<UpdateBuilding />} />
            <Route
              path="/BuildingPdfUploader"
              element={<BuildingPdfUploader />}
            />

            <Route path="/UserAccess" element={<UserAccess />} />

            <Route path="/CreateLease" element={<CreateLease />} />
            <Route path="/LeaseList" element={<LeaseList />} />
            <Route path="/UpdateLease" element={<UpdateLease />} />
            <Route path="/LeaseInfo" element={<LeaseInfomation />} />

            <Route
              path="/Approved_Denied_list"
              element={<Approved_Denied_list />}
            />

            <Route
              path="/ComparativeBuildingData"
              element={<ComparativeBuildingData />}
            />

            <Route
              path="/ComparativeBuildingList"
              element={<ComparativeBuildingList />}
            />

            <Route path="/GeneralInfoupload" element={<GeneralInfoupload />} />

            <Route
              path="/adminInformationCollaboration"
              element={<AdminInformationCollaboration />}
            />

            <Route
              path="/distilledExpenseTracker"
              element={<DistilledExpenseTracker />}
            />

            <Route
              path="/distilledExpenseTrackerPage"
              element={<DistilledExpenseTrackerPage />}
            />

            <Route path="/subleaseTracker" element={<SubleaseTracker />} />
            <Route
              path="/subleaseTrackerList"
              element={<SubleaseTrackerList />}
            />
            <Route path="/renewalTracker" element={<RenewalTracker />} />

            <Route
              path="/renewalTrackerbuildingList"
              element={<RenewalTrackerList />}
            />

            <Route path="/admin-portfolio-forum" element={<PortfolioForum />} />
            <Route path="/create-forum" element={<CreateThread />} />

            <Route path="/space-inquiry" element={<SpaceInquiry />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/UserBuildinglist" element={<UserBuildinglist />} />
            <Route
              path="/ComparativeUserBuildinglist"
              element={<ComparativeUserBuildinglist />}
            />

            <Route path="/UserLease" element={<UserLeaseList />} />
            <Route path="/CreNews" element={<CreNews />} />
            <Route path="/UserChat" element={<UserChat />} />

            <Route path="/ChatWithAnyDoc" element={<ChatWithAnyDoc />} />
            <Route path="/chatWindow" element={<ChatWindow />} />

            <Route path="/UserProfile" element={<UserProfile />} />
            <Route
              path="/ComparativeBuildingChat"
              element={<ComparativeBuildingChat />}
            />
            <Route
              path="/InformationCollaboration"
              element={<InformationCollaboration />}
            />
            <Route
              path="/InformationCollaborationList"
              element={<AdminInformationCollaboration />}
            />
            <Route
              path="/InformationCollaborationPage"
              element={<InformationCollaborationPage />}
            />

            <Route
              path="/LeaseAbstractUpload1"
              element={<LeaseAbstractUpload />}
            />
            <Route path="/SummeryUpload" element={<SummeryUpload />} />

            <Route path="/ReportChat" element={<ReportChat />} />

            <Route path="/EmailDrafting" element={<EmailDrafting />} />

            <Route path="/ThirdPartychat" element={<BrokerChat />} />
            <Route path="/ColleagueChat" element={<ColleagueChat />} />
            <Route path="/BuildingChat" element={<BuildingChat />} />
            <Route
              path="/SelectUserBuildingCategory"
              element={<SelectUserBuildingCategory />}
            />
            <Route
              path="/UserBuildingInfolist"
              element={<UserBuildingInfolist />}
            />

            <Route path="/CompsChat" element={<MarketChat />} />
            <Route path="/TenantMarket" element={<TenantMarket />} />
            <Route
              path="/TenantInformationChat"
              element={<TenantInformation />}
            />
            <Route
              path="/tenentInfoUserBuildinglist"
              element={<TenentInfoUserBuildinglist />}
            />

            <Route
              path="/SubleaseTrackerChat"
              element={<SubleaseTrackerChat />}
            />
            <Route
              path="/SubleaseTrackerBuildinglist"
              element={<SubleaseTrackerList />}
            />

            <Route
              path="/RenewalTrackerList"
              element={<RenewalTrackerList />}
            />

            <Route path="/renewalTracker" element={<RenewalTracker />} />

            <Route
              path="/renewalTrackerList"
              element={<RenewalTrackerList />}
            />

            {/* <Route
              path="/SubleaseTrackerBuildinglist"
              element={<SubleaseTrackerUserBuildinglist />}
            /> */}

            <Route path="/geminichat" element={<GeminiChat />} />

            <Route path="/notes" element={<Notes />} />

            <Route path="/benchmark" element={<Benchmark />} />

            <Route path="/tours" element={<ToursPage />} />

            <Route path="/toursform" element={<Tours />} />
            <Route path="/toursDetails" element={<ToursDetails />} />

            <Route path="/create-forum" element={<CreateThread />} />

            <Route path="/portfolio-forum" element={<PortfolioForum />} />

            <Route path="/history" element={<SessionList />} />

            <Route path="/calculator" element={<CalulatorPage />} />

            <Route path="/dealList" element={<DealList />} />

            <Route path="/deals/:dealId" element={<DealDetailView />} />

            <Route path="/deals/new" element={<DealForm />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
