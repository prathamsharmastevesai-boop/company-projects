import { configureStore } from '@reduxjs/toolkit';
import loginReducer from "../Slice/LoginSlice";
import BuildingReducer from "../Slice/BuildingSlice";
import OfficeReducer from "../Slice/LeaseSlice";
import DocReducer from "../Slice/DocSlice";
import ProfileReducer from "../../User/Slice/ProfileSlice"

const store = configureStore({
    reducer: {
        loginSlice: loginReducer,
        BuildingSlice:BuildingReducer,
        OfficeSlice:OfficeReducer,
        DocSlice:DocReducer,
        //user slice
        ProfileSlice:ProfileReducer
    },
});

export default store;
