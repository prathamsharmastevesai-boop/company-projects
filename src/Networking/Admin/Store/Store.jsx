import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Slice/LoginSlice";
import BuildingReducer from "../Slice/BuildingSlice";
import OfficeReducer from "../Slice/LeaseSlice";
import DocReducer from "../Slice/DocSlice";
import ProfileReducer from "../../User/Slice/ProfileSlice";
import ForumReducer from "../Slice/forumSlice";
import notesReducer from "../../User/Slice/notesSlice";
import subleaseReducer from "../Slice/subleaseTrackerSlice";
import RenewalReducer from "../Slice/RenewalTrackerSlice";

const store = configureStore({
  reducer: {
    loginSlice: loginReducer,
    BuildingSlice: BuildingReducer,
    LeaseSlice: OfficeReducer,
    DocSlice: DocReducer,
    ProfileSlice: ProfileReducer,
    ForumSlice: ForumReducer,
    notesSlice: notesReducer,
    subleaseSlice: subleaseReducer,
    RenewalSlice: RenewalReducer,
  },
});

export default store;
