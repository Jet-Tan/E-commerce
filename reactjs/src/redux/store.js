import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slide/productSlide";
import userReducer from "./slide/userSlide";
import orderSlice from "./slide/orderSlide";
export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    order: orderSlice,
  },
});
