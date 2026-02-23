import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pointsReducer from './pointsSlice';
import { api } from './api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        points: pointsReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

