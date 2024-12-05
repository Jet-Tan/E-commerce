const userRouter = require("./userRouter");
const productRouter = require("./productRouter");

const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
};

module.exports = routes;
