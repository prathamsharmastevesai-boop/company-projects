import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Slice/LoginSlice";
import BuildingReducer from "../Slice/BuildingSlice";
import OfficeReducer from "../Slice/LeaseSlice";
import DocReducer from "../Slice/DocSlice";
import ProfileReducer from "../../User/Slice/ProfileSlice";
import ForumReducer from "../Slice/forumSlice";
import notesReducer from "../../User/Slice/notesSlice";

const store = configureStore({
  reducer: {
    loginSlice: loginReducer,
    BuildingSlice: BuildingReducer,
    LeaseSlice: OfficeReducer,
    DocSlice: DocReducer,
    ProfileSlice: ProfileReducer,
    ForumSlice: ForumReducer,
    notesSlice: notesReducer,
  },
});

export default store;
