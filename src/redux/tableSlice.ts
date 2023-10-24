
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface TableItem {
  count: number;
  next?: string;
  previous?: string; 
  results: any[];
}

interface TableState {
  data: TableItem;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined | null;
}

const initialState: TableState = {
  data: { count: 65, results: []},
  status: 'idle',
  error: null,
};

export const fetchTableData = createAsyncThunk('table/fetchData', async (offset: number) => {
  const response = await axios.get(`http://146.190.118.121/api/table/?limit=10&offset=${offset}`);
  return response.data;
});

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default tableSlice.reducer;
