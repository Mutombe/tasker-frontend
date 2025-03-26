// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import taskReducer from '../slices/taskSlice';
import applicationReducer from '../slices/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    application: applicationReducer,
    },
});