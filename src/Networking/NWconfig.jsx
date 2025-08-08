//BASE URL
export const baseURL = import.meta.env.VITE_BASE_URL;

//AUTH
export const login = "/auth/login";
export const Sigup = "/auth/register";
export const VerifyOtp = "/auth/verify_otp";
export const ForgetPassword = "/auth/forgot_password";
export const ResetPasswod = "/auth/reset_password";

//PROFILE
export const ProfileDetail = "/auth/user/profile";
export const ProfileUpdateDetail = "/auth/user/profile/update";

//BUILDING
export const CreateBuilding = "/building_operations/create_buildings";
export const ListBuilding = "/building_operations/list_buildings";
export const UpdateBuildingEndpoint = "/building_operations/update_building";
export const DeleteBuildingEndpoint = "/building_operations/delete_building/";

//OFFICE
export const CreateLeaseEndpoint = "/lease/create_lease";
export const LeaselistEndpoint = "/lease/list_leases";
export const UpdateLeaseeEndpoint = "/lease/update_lease";
export const DeleteLeaseEndpoint = "/lease/delete_lease";

//LEASE
export const UploadDoc = "/chatbot/upload_lease_doc/";
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
export const Session_List_Specific = "/user/chat/sessions/";
export const Chat_history_Specific = "/user/chat/history/";
export const Session_Delete_Specific =  "/user/chat/delete/";

//PERMISSON FOR BUILDING
export const Request_list = "/building_permissions/pending_requests";
export const Request_approve_deny = "/building_permissions/action_request";
export const Request_permission = "/building_permissions/request_access";
export const Approved_list = "/building_permissions/approved_requests";
export const Denied_list = "/building_permissions/denied_requests";

//GENERAL INFO BUILDING
export const Upload_General_info = "/genral-builidng/buildings/documents/upload"