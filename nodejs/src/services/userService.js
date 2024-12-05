const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");
const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password || !data.confirmPassword) {
        resolve({
          errCode: -1,
          message: "Missing require parameter!",
        });
      } else {
        const reg =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isCheckEmail = reg.test(data.email);
        if (!isCheckEmail) {
          resolve({
            errCode: -1,
            message: "The input is email",
          });
        }
        if (data.password !== data.confirmPassword) {
          resolve({
            errCode: -1,
            message: "The input is password",
          });
        }
        const checkUser = await User.findOne({
          email: data.email,
        });
        if (checkUser !== null) {
          resolve({
            errCode: -1,
            message: "The email is already",
          });
        }
        const hash = bcrypt.hashSync(data.password, 10);
        const createdUser = await User.create({
          name: data.name,
          email: data.email,
          password: hash,
          phone: data.phone,
          address: data.address,
          avatar: data.avatar,
        });
        if (createdUser) {
          resolve({
            errCode: 0,
            message: "SUCCESS",
            data: createUser,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userLogin.email || !userLogin.password) {
        resolve({
          errCode: -1,
          message: "Missing require parameter!",
        });
      } else {
        const reg =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isCheckEmail = reg.test(userLogin.email);
        if (!isCheckEmail) {
          resolve({
            errCode: -1,
            message: "The input is email",
          });
        }
        const checkUser = await User.findOne({
          email: userLogin.email,
        });
        if (checkUser === null) {
          resolve({
            errCode: -1,
            message: "The user is not defined",
          });
        }
        const comparePassword = bcrypt.compareSync(
          userLogin.password,
          checkUser.password
        );
        if (!comparePassword) {
          resolve({
            errCode: -1,
            message: "The password is incorrect",
          });
        }
        const access_token = await genneralAccessToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin,
        });
        const refresh_token = await genneralRefreshToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin,
        });
        resolve({
          errCode: 0,
          message: "OK",
          access_token,
          refresh_token,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: -1,
          message: "The userId is required",
        });
      }
      const checkUser = await User.findOne({ _id: userId });
      if (!checkUser) {
        resolve({
          errCode: -1,
          message: "The user is not defined",
        });
      }
      const update = await User.findByIdAndUpdate(userId, data, {
        new: true,
      });
      resolve({
        errCode: 0,
        message: "OK",
        data: update,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: -1,
          message: "The userId is required",
        });
      } else {
        const checkUser = await User.findOne({ _id: userId });
        if (!checkUser) {
          resolve({
            errCode: -1,
            message: "The user is not defined",
          });
        }
        await User.findByIdAndDelete(userId);
        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        errCode: 0,
        message: "OK",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          message: "The id is required",
        });
      } else {
        const user = await User.findOne({ _id: id });
        if (!user) {
          resolve({
            errCode: -1,
            message: "The user is not defined",
          });
        }
        resolve({
          errCode: 0,
          message: "OK",
          data: user,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMany = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ids) {
        resolve({
          errCode: -1,
          message: "The id is required",
        });
      } else {
        await User.deleteMany({ _id: ids });
        resolve({
          errCode: 0,
          message: "Delete many success!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  deleteMany,
};
