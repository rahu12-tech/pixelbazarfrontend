import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/cart/cartSlice";

import wishlistReducer from "../redux/wishlist/wishlistSlice";


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
});
