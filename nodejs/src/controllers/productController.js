const productService = require("../services/productService");
const jwtService = require("../services/jwtService");
const createProduct = async (req, res) => {
  try {
    let data = await productService.createProduct(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    let data = await productService.updateProduct(req.params.id, req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    let data = await productService.deleteProduct(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    let data = await productService.getAllProduct(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    let data = await productService.getDetailProduct(req.params.id);
    return res.status(200).json(data);
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
    let data = await productService.deleteMany(ids);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      errCode: -1,
      message: "Error from the server",
    });
  }
};

const getAllType = async (req, res) => {
  try {
    let data = await productService.getAllType();
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
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
  deleteMany,
  getAllType,
};
