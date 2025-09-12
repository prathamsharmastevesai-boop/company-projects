//BASE URL
export const baseURL = import.meta.env.VITE_BASE_URL;

//AUTH
export const login = "/auth/login";
export const Sigup = "/auth/register";
export const VerifyOtp = "/auth/verify_otp";
export const ForgetPassword = "/auth/forgot_password";
export const ResetPasswod = "/auth/reset_password";
export const UserDelete = "/auth/user/";

//PROFILE
export const ProfileDetail = "/auth/user/profile";
export const ProfileUpdateDetail = "/auth/user/profile/update";

//BUILDING
export const CreateBuilding = "/building_operations/create_buildings";
export const ListBuilding = "/building_operations/list_buildings";
export const UpdateBuildingEndpoint = "/building_operations/update_building";
export const DeleteBuildingEndpoint = "/building_operations/delete_building/";

//Lease
export const CreateLeaseEndpoint = "/lease/create_lease";
export const LeaselistEndpoint = "/lease/list_leases";
export const UpdateLeaseeEndpoint = "/lease/update_lease";
export const DeleteLeaseEndpoint = "/lease/delete_lease";

//LEASE Document
export const UploadDoc = "/chatbot/upload_building_doc/";
export const UpdateDoc = "/chatbot/update_files/";
export const ListDoc = "/chatbot/files/";
export const DeleteDoc = "/chatbot/delete_files/";


//ASK QUESTION
export const AskQuestion = "/chatbot/ask_question/";
export const Old_history = "/chatbot/chat/sessions/";
export const Chat_history = "/chatbot/chat/history/";
export const Del_Chat_Session = "/chatbot/chat/";


//SPECIFIC CHAT
export const Upload_specific_file = "/user/standalone/upload";
export const List_specific_Docs = "/user/list_simple_files/";
export const AskQuestion_Specific = "/user/ask_simple/";
// export const Session_List_Specific = "/user/chat/sessions/";
export const Session_List_Specific = "/chatbot/chat/sessions/";
// export const Chat_history_Specific = "/admin_user_chat/chat/history/";
export const Chat_history_Specific = "/user/chat/history/"
export const Session_Delete_Specific = "/user/chat/delete/";
export const Doc_Delete_Specific = "/user/delete_simple_file/";

//GENERAL INFO
export const listGeneralInfoDoc = "/admin_user_chat/list";
export const UploadGeneralDoc = "/admin_user_chat/upload";
export const updateGenralDoc = "/admin_user_chat/update";
export const AskGeneralDoc = "/user/ask_simple/";

//PERMISSON FOR BUILDING
export const Request_list = "/building_permissions/pending_requests";
export const Request_approve_deny = "/building_permissions/action_request";
export const Request_permission = "/building_permissions/request_access";
export const Approved_list = "/building_permissions/approved_requests";
export const Denied_list = "/building_permissions/denied_requests";

//GENERAL INFO BUILDING
export const Upload_General_info = "/genral-builidng/buildings/documents/upload"


//Admin Dashboard
export const dashboardData = "/admin/stats";

//AI INSLILGHTS
export const AIAnalyticsData = "/admin/analytics";

export const AIInsights = "/admin/ai_insights";

export const RecentQuestion = "/admin/recent_questions";

export const UsageTreads = "/admin/usage_trends";

export const ActivitySummary = "/admin/activity_summary";

//System Tracing
export const SystemTracing = "/admin/system_tracing";

//USER MANAGEMENT
export const InviteUser = "/invite_user/admin";
export const userList = "/invite_user/admin/invited-users";

//AI LEASE DRAFTING
export const upload_Drafting_Lease = "/generate_lease/upload/simple";
export const listDraftingDoc = "/generate_lease/list_category_files/"
export const deleteDraftingDoc = "/generate_lease/delete_file/";
export const extractMetadata = "/generate_lease/files/extract-metadata";
export const extractTextdata = "/generate_lease/files/lease-agreement-text";
export const updatetextdata = "/generate_lease/files/update-extracted-text";


//SUPER ADMIN
export const inviteAdmin = "/auth/invite-admin";
export const listAdmin = "/invite_user/list";