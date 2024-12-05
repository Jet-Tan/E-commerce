import axios from "axios";
import { axiosJWT } from "./userService";

export const getAllProduct = async (search, limit) => {
  let res = {};
  if (search.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/product/get-all-product?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/product/get-all-product?limit=${limit}`
    );
  }
  return res;
};

export const getProductType = async (type, page, limit) => {
  let res = {};
  if (type) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/product/get-all-product?filter=type&filter=${type}&page=${page}&limit=${limit}`
    );
  }
  return res;
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/product/create-product`,
    data
  );
  return res.data;
};

export const getDetailProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/product/get-detail-product/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/api/product/update-product/${id}`,
    data,
    { headers: { authorization: `Bearer ${access_token}` } }
  );
  return res.data;
};
export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/api/product/delete-product/${id}`,
    { headers: { authorization: `Bearer ${access_token}` } }
  );
  return res;
};

export const deleteAllProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/api/product/delete-many`,
    data,
    { headers: { authorization: `Bearer ${access_token}` } }
  );
  return res;
};

export const getAllType = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/product/get-all-type`
  );
  return res.data;
};
