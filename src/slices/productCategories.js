import { createSlice } from "@reduxjs/toolkit";
import {
  getProductsCategories,
  createProductCategory,
  updateProductCategory,
  getProductCategory,
} from "@services/index";

const initialState = {
  productCategories: [],
  productCategory: {},
  count: null,
  loading: true,
  error: null,
};

const productCategories = createSlice({
  name: "productCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.productCategory = action.payload?.payload;
      state.count = action.payload?.count;
    });
    builder.addCase(getProductCategory.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getProductsCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductsCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.productCategories = action.payload?.payload;
      state.count = action.payload?.count;
    });
    builder.addCase(getProductsCategories.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(createProductCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProductCategory.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createProductCategory.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateProductCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductCategory.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateProductCategory.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { reducer } = productCategories;

export default productCategories;
