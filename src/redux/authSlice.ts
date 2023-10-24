import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Credentials {
  username: string;
  password: string | null;
}

interface AuthState {
    user: any; 
    error: string | null | unknown;
    isAuthenticated: boolean;
  }
  

const initialState: AuthState = {
  user: null,
  error: null,
  isAuthenticated: false,
};

const loginApiEndpoint = async (credentials: Credentials) => {
  const response = await fetch("http://146.190.118.121/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error("Authentication failed");
    }
    return await response.json();
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      const response = await loginApiEndpoint(credentials);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      
      return rejectWithValue("An error occurred.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});``

export default authSlice.reducer;
