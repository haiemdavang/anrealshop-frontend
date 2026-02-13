import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FavoriteService from '../service/FavoriteService';
import { logoutUser } from './authSlice';

interface FavoriteState {
    productIds: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: FavoriteState = {
    productIds: [],
    status: 'idle',
};

export const fetchFavoriteIds = createAsyncThunk(
    'favorites/fetchIds',
    async () => {
        const ids = await FavoriteService.getMyFavoriteProductIds();
        return Array.from(ids);
    },
    {
        condition: (_, { getState }) => {
            const { favorites } = getState() as { favorites: FavoriteState };
            // Chỉ fetch khi idle, tránh gọi lại khi đang loading hoặc đã succeeded
            return favorites.status === 'idle';
        },
    }
);

export const addFavorite = createAsyncThunk(
    'favorites/add',
    async (productId: string) => {
        await FavoriteService.addFavorite(productId);
        return productId;
    }
);

export const removeFavorite = createAsyncThunk(
    'favorites/remove',
    async (productId: string) => {
        await FavoriteService.removeFavoriteByProductId(productId);
        return productId;
    }
);

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.productIds = [];
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavoriteIds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.productIds = action.payload;
            })
            .addCase(fetchFavoriteIds.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                if (!state.productIds.includes(action.payload)) {
                    state.productIds.push(action.payload);
                }
            })
            .addCase(addFavorite.rejected, (state, action) => {
                // rollback: remove nếu đã optimistic add
                state.productIds = state.productIds.filter(id => id !== action.meta.arg);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.productIds = state.productIds.filter(id => id !== action.payload);
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                // rollback: add lại nếu đã optimistic remove
                if (!state.productIds.includes(action.meta.arg)) {
                    state.productIds.push(action.meta.arg);
                }
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.productIds = [];
                state.status = 'idle';
            });
    },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
