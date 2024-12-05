import React, { Fragment, useEffect } from "react";
import { routes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DefaultComponent } from "./components/DefaultComponent/DefaultComponent";
import { useDispatch, useSelector } from "react-redux";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as userService from "./services/userService";
import { updateUser } from "./redux/slide/userSlide";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { storageData, decoded };
  };
  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, []);
  userService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await userService.refreshToken();
        config.headers["token"] = `Beare ${data?.access_token}`;
      }
      return config;
    },
    (e) => {
      return Promise.reject(e);
    }
  );
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page;
            const Layout = route.isShow === true ? DefaultComponent : Fragment;
            const isCheckAut = !route.isPrivate || user.isAdmin;
            return (
              <Route
                key={index}
                path={isCheckAut ? route.path : ""}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
