import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDentists = createAsyncThunk(
  'dentists/fetchDentists',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/dentists`
      );
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const dentistSlice = createSlice({
  name: 'dentists',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDentists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDentists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchDentists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch dentists';
      });
  }
});

export default dentistSlice.reducer;
