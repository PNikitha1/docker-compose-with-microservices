
// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./auth/authSlice";
import noticesReducer from "./notices/noticeSlice";
import roomReducer from "./room/roomSlice";
import ticketsReducer from "./tickets/ticketSlice";
import tenantsReducer from "./tenants/tenantSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    notices: noticesReducer,
    rooms:roomReducer,
    tickets: ticketsReducer,
     tenants: tenantsReducer
  },
});
