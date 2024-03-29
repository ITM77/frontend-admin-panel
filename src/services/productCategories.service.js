import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const getProductsCategories = createAsyncThunk(
  "productCategories/getProductCategories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get("/products/categories", {
        params: {
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 10,
          search: params?.search ?? "",
        },
      });
      return response.data;
    } catch (error) {
      // toast.error(error?.messages[0]?.error || error?.messages[0]);
      return rejectWithValue(error.error);
    }
  }
);

export const getProductCategory = createAsyncThunk(
  "productCategories/getProductCategory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/products/categories/info/${params?.id}`
      );
      return response.data;
    } catch (error) {
      // toast.error(error?.messages[0]?.error || error?.messages[0]);
      return rejectWithValue(error.error);
    }
  }
);

export const createProductCategory = createAsyncThunk(
  "productCategories/ProductCategory",
  async ({ values, resetForm }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/products/categories", values);
      toast.success("Категория продукта добавлен");
      resetForm();
      return response.data;
    } catch (error) {
      // toast.error(error?.messages[0]?.error || error?.messages[0]);
      return rejectWithValue(error.messages);
    }
  }
);

export const updateProductCategory = createAsyncThunk(
  "productCategories/updateProductCategory",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.put("/products/categories", values);
      toast.success("Категория продукта обнавлен");
      return response.data;
    } catch (error) {
      // toast.error(error?.messages[0]?.error || error?.messages[0]);
      return rejectWithValue(error.messages);
    }
  }
);
