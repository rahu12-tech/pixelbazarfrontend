import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {
    items: [],
    totalQty: 0,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: storedWishlist,
    reducers: {
        addToWishlist: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({ ...action.payload, qty: 1 });
            }
            state.totalQty = state.items.reduce((acc, item) => acc + item.qty, 0);
            localStorage.setItem("wishlist", JSON.stringify(state));
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.totalQty = state.items.reduce((acc, item) => acc + item.qty, 0);
            localStorage.setItem("wishlist", JSON.stringify(state));
        },
    },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
