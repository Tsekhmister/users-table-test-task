import { configureStore } from '@reduxjs/toolkit';
import tableReducer from "./tableSlice";
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    table: tableReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AuthState = ReturnType<typeof store.getState>; 
export type AuthDispatch = typeof store.dispatch;

export default store;