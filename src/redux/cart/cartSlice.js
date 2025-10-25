import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage if available
const storedCart = JSON.parse(localStorage.getItem("cart")) || {
    items: [],
    totalQty: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: storedCart,
    reducers: {
        addToCart: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({ ...action.payload, qty: 1 });
            }
            state.totalQty = state.items.reduce((acc, item) => acc + item.qty, 0);
            localStorage.setItem("cart", JSON.stringify(state)); // save to localStorage
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.totalQty = state.items.reduce((acc, item) => acc + item.qty, 0);
            localStorage.setItem("cart", JSON.stringify(state));
        },
        updateQty: (state, action) => {
            const { id, type } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (type === "inc") item.qty += 1;
                if (type === "dec" && item.qty > 1) item.qty -= 1;
            }
            state.totalQty = state.items.reduce((acc, item) => acc + item.qty, 0);
            localStorage.setItem("cart", JSON.stringify(state));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQty = 0;
            localStorage.setItem("cart", JSON.stringify(state));
        },
    },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
