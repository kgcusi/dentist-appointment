import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data; // Array of appointments
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAppointment = createAsyncThunk(
  'appointments/fetchAppointment',
  async (appointmentId, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/api/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data; // Single appointment
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async ({ dentistId, appointmentDate, timeSlot }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ dentistId, appointmentDate, timeSlot })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }

      return data; // Created appointment
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, updates }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/appointments/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }

      return data; // Updated appointment
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async (appointmentId, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/api/appointments/${appointmentId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data);
      }
      return appointmentId; // Return the ID of the deleted appointment
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch appointments';
      })
      .addCase(fetchAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.list.findIndex(
          (appt) => appt._id === action.payload._id
        );
        if (index === -1) {
          state.list.push(action.payload);
        } else {
          state.list[index] = action.payload;
        }
      })
      .addCase(fetchAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch appointment';
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.list.findIndex(
          (appt) => appt._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update appointment';
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.list = state.list.filter((appt) => appt._id !== action.payload);
      });
  }
});

export default appointmentSlice.reducer;
