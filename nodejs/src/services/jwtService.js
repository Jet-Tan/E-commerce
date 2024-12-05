const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN, {
    expiresIn: "10h",
  });
  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN, {
    expiresIn: "365d",
  });
  return refresh_token;
};

const refreshToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            errCode: -1,
            message: "The authemtication",
          });
        }
        const access_token = await genneralAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        resolve({
          errCode: 0,
          message: "Success",
          access_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshToken,
};
