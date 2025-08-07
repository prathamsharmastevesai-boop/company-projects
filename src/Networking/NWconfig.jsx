//BASE URL
export const baseURL = import.meta.env.VITE_BASE_URL;

//AUTH
export const login = import.meta.env.VITE_LOGIN_ENDPOINT;
export const Sigup = import.meta.env.VITE_SIGNUP_ENDPOINT;
export const VerifyOtp = import.meta.env.VITE_VERIFYOTP_ENDPOINT;
export const ForgetPassword = import.meta.env.VITE_FORGETPASSWORD_ENDPOINT;
export const ResetPasswod = import.meta.env.VITE_RESETPASSWORD_ENDPOINT;

//PROFILE
export const ProfileDetail = import.meta.env.VITE_PROFILE_ENDPOINT;
export const ProfileUpdateDetail = import.meta.env.VITE_PROFILE_UPDATE_ENDPOINT

//BUILDING
export const CreateBuilding = import.meta.env.VITE_CREATEBUILDING_ENDPOINT;
export const ListBuilding = import.meta.env.VITE_LISTOFBUILDING_ENDPOINT;
export const UpdateBuildingEndpoint = import.meta.env.VITE_UPDATEBUILDING_ENDPOINT;
export const DeleteBuildingEndpoint = import.meta.env.VITE_DELETEBUILDING_ENDPOINT;

//OFFICE
export const CreateLeaseEndpoint = import.meta.env.VITE_CREATELEASE_ENDPOINT;
export const LeaselistEndpoint = import.meta.env.VITE_LEASELIST_ENDPOINT;
export const UpdateLeaseeEndpoint = import.meta.env.VITE_UPDATELEASE_ENDPOINT;
export const DeleteLeaseEndpoint = import.meta.env.VITE_DELETELEASE_ENDPOINT;

//LEASE
export const UploadDoc = import.meta.env.VITE_UPLOADDOC_ENDPOINT;
export const UpdateDoc = import.meta.env.VITE_UPDATEDOC_ENDPOINT;
export const ListDoc=  import.meta.env.VITE_LISTDOC_ENDPOINT;
export const DeleteDoc = import.meta.env.VITE_DELETEDOC_ENDPOINT;


//ASK QUESTION
export const AskQuestion = import.meta.env.VITE_ASkQUESTION_ENDPOINT;
export const Old_history = import.meta.env.VITE_Old_chat_history_ENDPOINT;
export const Chat_history = import.meta.env.VITE_chat_history_ENDPOINT;
export const Del_Chat_Session =import.meta.env.VITE_DELETE_CHAT_SESSION_ENDPOINT;


//SPECIFIC CHAT
export const Upload_specific_file = import.meta.env.VITE_SPECIFIC_CHAT_ENDPOINT;
export const List_specific_Docs = import.meta.env.VITE_SPECIFIC_CHAT_Doc_List_ENDPOINT;
export const AskQuestion_Specific = import.meta.env.VITE_SPECIFIC_ASkQUESTION_ENDPOINT;
export const Session_List_Specific = import.meta.env.VITE_SPECIFIC_SESSION_LIST_ENDPOINT
export const Chat_history_Specific = import.meta.env.VITE_SPECIFIC_CHAT_HISTORY_ENDPOINT

//PERMISSON FOR BUILDING
export const Request_list = import.meta.env.VITE_PERMISSION_LEASE_REQUEST_LIST_ENDPOINT;
export const Request_approve_deny = import.meta.env.VITE_PERMISSION_LEASE_REQUEST_APPROVE_DENY_ENDPOINT;
export const Request_permission = import.meta.env.VITE_PERMISSION_LEASE_REQUEST_USER_ENDPOINT;
export const Approved_list = import.meta.env.VITE_Approved_list_ENDPOINT;
export const Denied_list = import.meta.env.VITE_Denied_list_ENDPOINT;

//GENERAL INFO BUILDING
export const Upload_General_info = import.meta.env.VITE_GENERAL_INFO_BUILDING_ENDPOINT