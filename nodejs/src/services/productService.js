const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");
const createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.type ||
        !data.price ||
        !data.countInStock ||
        !data.rating ||
        !data.description
      ) {
        resolve({
          errCode: -1,
          message: "Missing require parameter!",
        });
      } else {
        const checkProduct = await Product.findOne({
          name: data.name,
        });
        if (checkProduct) {
          resolve({
            errCode: 1,
            message: "The name of product is already",
          });
        }
        const newProduct = await Product.create({
          name: data.name,
          image: data.image,
          type: data.type,
          price: data.price,
          countInStock: data.countInStock,
          rating: data.rating,
          description: data.description,
        });
        if (newProduct) {
          resolve({
            errCode: 0,
            message: "OK",
            data: newProduct,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        return resolve({
          errCode: -1,
          message: "The ProductId is required",
        });
      }
      const checkProduct = await Product.findOne({ _id: productId });
      if (!checkProduct) {
        return resolve({
          errCode: -1,
          message: "The Product is not defined",
        });
      }
      const update = await Product.findByIdAndUpdate(productId, data, {
        new: true,
      });
      if (!update) {
        return resolve({
          errCode: -1,
          message: "Failed to update the product",
        });
      }
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

const deleteProduct = (ProductId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ProductId) {
        resolve({
          errCode: -1,
          message: "The ProductId is required",
        });
      } else {
        const checkProduct = await Product.findOne({ _id: ProductId });
        if (!checkProduct) {
          resolve({
            errCode: -1,
            message: "The Product is not defined",
          });
        }
        await Product.findByIdAndDelete(ProductId);
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

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const allProductFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        resolve({
          errCode: 0,
          message: "OK",
          data: allProductFilter,
          total: totalProduct,
          totalPage: Math.ceil(totalProduct / limit),
          totalCurrent: page + 1,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          errCode: 0,
          message: "OK",
          data: allProductSort,
          total: totalProduct,
          totalPage: Math.ceil(totalProduct / limit),
          totalCurrent: page + 1,
        });
      }
      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        errCode: 0,
        message: "OK",
        data: allProduct,
        total: totalProduct,
        totalPage: Math.ceil(totalProduct / limit),
        totalCurrent: page + 1,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          message: "The id is required",
        });
      } else {
        const product = await Product.findOne({ _id: id });
        if (!Product) {
          resolve({
            errCode: -1,
            message: "The Product is not defined",
          });
        }
        resolve({
          errCode: 0,
          message: "OK",
          data: product,
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
          message: "The ids is required",
        });
      } else {
        await Product.deleteMany({ _id: ids });
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

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        errCode: 0,
        message: "Success!",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
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
