import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;