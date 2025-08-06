import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Networking/Admin/Store/Store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import { UserLeaseList } from "./Pages/User/Lease/UserLeaselist"
import { UserProfile } from "./Pages/User/Profile/UserProfile";
import { UserChat } from "./Pages/User/Chat/ChatUser";
import { ChatWithAnyDoc } from "./Pages/User/Chat/ChatwithAny";
import BuildingPdfUploader from "./Pages/Admin/Building/BuildingGenInfo";
import { ForgotPassword } from "./Pages/User/Auth/ForgetPassword";
import { ResetPassword } from "./Pages/User/Auth/ResetPassword";
import { Approved_Denied_list } from "./Pages/Admin/Approved_Denied_list";
import { Home } from "./Pages/Home";

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
          {/* Public Routes  */}
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/VerifyOtp" element={<VerifyOtp />} />
          <Route path="/Admin" element={<AdminLogin />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />          

          {/* Protected Admin Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/CreateBuilding" element={<CreateBuilding />} />
            <Route path="/Building_list" element={<ListBuilding />} />
            <Route path="/UpdateBuilding" element={<UpdateBuilding />} />
            <Route path="/BuildingPdfUploader" element={<BuildingPdfUploader />} />
            <Route path="/UserAccess" element={<UserAccess />} />
            <Route path="/CreateLease" element={<CreateLease />} />
            <Route path="/LeaseList/:id" element={<LeaseList />} />
            <Route path="/UpdateLease" element={<UpdateLease />} />
            <Route path="/LeaseInfo" element={<LeaseInfomation />} />
            <Route path="/Approved_Denied_list" element={<Approved_Denied_list />} />
          </Route>

          {/* Protected User Route */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/UserBuildinglist" element={<UserBuildinglist />} />
            <Route path="/UserLeaseList/:id" element={<UserLeaseList />} />
            <Route path="/UserChat" element={<UserChat />} />
            <Route path="/ChatWithAnyDoc" element={<ChatWithAnyDoc />} />
            <Route path="/UserProfile" element={<UserProfile />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
