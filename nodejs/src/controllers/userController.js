const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
const createUser = async (req, res) => {
  try {
    let data = await userService.createUser(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let response = await userService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: "Strict",
    });
    return res.status(200).json(newResponse);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let infor = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    let data = await userService.deleteUser(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    let data = await userService.getAllUser();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    let data = await userService.getDetailUser(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(200).json({
        errCode: -1,
        message: "The token is required",
      });
    }
    let data = await jwtService.refreshToken(token);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      errCode: 0,
      message: "Logout successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    let data = await userService.deleteMany(ids);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  logoutUser,
  deleteMany,
};
