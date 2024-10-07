import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dentistReducer from '../features/dentists/dentistSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dentists: dentistReducer,
    appointments: appointmentReducer
  }
});

export default store;
