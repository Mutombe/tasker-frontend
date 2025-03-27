// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import taskReducer from '../slices/taskSlice';
import applicationReducer from '../slices/applicationSlice';
import setupInterceptors from "../../utils/api";
import { logout } from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    application: applicationReducer,
  },
});

// Setup API interceptors after store creation
setupInterceptors(store, logout);