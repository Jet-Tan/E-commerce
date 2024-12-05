import React, { useEffect, useState } from "react";
import { Image, message } from "antd";
import "./SignInPage.scss";
import { InputForm } from "../../components/InputForm/InputForm";
import imageLogin from "../../assets/login.png";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import * as userService from "../../services/userService";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slide/userSlide";
export const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: (data) => userService.loginUser(data),
  });
  const { data } = mutation;
  useEffect(() => {
    if (data && data.errCode === 0) {
      if (location?.state) {
        navigate(location.state);
      } else {
        navigate("/");
      }
      message.success("Sign in success!");

      const accessToken = data?.access_token;
      localStorage.setItem("access_token", JSON.stringify(accessToken));

      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, accessToken);
        }
      }
    }
  }, [data, location]);
  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  const handleNavSignUp = () => {
    navigate("/sign-up");
  };

  const handleEye = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleOnClickLogin = () => {
    mutation.mutate({
      email,
      password,
    });
  };
  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <div className="sign-in-left">
          <h1>Xin chào</h1>
          <p>Đăng nhập vào tài khoản</p>
          <InputForm
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />
          <div className="sign-in-input-password">
            <InputForm
              placeholder="password"
              className="sign-in-password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
            />
            <span onClick={handleEye} className="sign-in-eye">
              {isShowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          {mutation.isError && (
            <span style={{ color: "red" }}>{mutation.error?.message}</span>
          )}
          {data?.errCode !== 0 && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <button className="btn-sign-in" onClick={handleOnClickLogin}>
            Đăng nhập
          </button>
          <span>Quên mật khẩu?</span>
          <p>
            Chưa có tài khoản ?
            <span onClick={handleNavSignUp}>Tạo tài khoản</span>
          </p>
        </div>
        <div className="sign-in-right">
          <Image
            src={imageLogin}
            preview={false}
            alt="image-login"
            height="230px"
            width="203"
          />
          <h4>Mua sắm</h4>
        </div>
      </div>
    </div>
  );
};
