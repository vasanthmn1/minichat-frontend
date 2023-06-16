import { configureStore } from "@reduxjs/toolkit";
import LinkSlice from "../feature/LinkSlice";



export const Store = configureStore({
    reducer: {
        link: LinkSlice,
    }
})
