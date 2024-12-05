const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      errCode: 1,
      message: "Authorization header is missing",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      errCode: 1,
      message: "Token is missing",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        errCode: 1,
        message: "Token is invalid or expired",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        errCode: 1,
        message: "Access denied",
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.params.id;
  if (!token) {
    return res.status(401).json({
      errCode: 1,
      message: "Token is missing",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        errCode: 1,
        message: "Token is invalid or expired",
      });
    }
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        errCode: 1,
        message: "The authemtication",
      });
    }
  });
};
module.exports = { authMiddleWare, authUserMiddleWare };
