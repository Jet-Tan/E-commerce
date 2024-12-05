import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/sign-in`,
    data
  );
  return res.data;
};

export const signUp = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/sign-up`,
    data
  );
  return res.data;
};

export const getDetailUser = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/api/user/get-detail-user/${id}`
  );
  return res;
};
export const getAllUser = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/user/get-all-user`
  );
  return res;
};
export const refreshToken = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/refresh-token`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/log-out`
  );
  return res;
};

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/api/user/update-user/${id}`,
    data,
    { headers: { authorization: `Bearer ${access_token}` } }
  );
  return res.data;
};
export const deleteUser = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/api/user/delete-user/${id}`,
    { headers: { authorization: `Bearer ${access_token}` } }
  );
  return res;
};

export const deleteAllUser = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/api/user/delete-many`,
    data,
    { headers: { authorization: `Bearer ${access_token}` } }
  );
  return res;
};
