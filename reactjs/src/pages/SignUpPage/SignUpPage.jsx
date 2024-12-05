import React, { useEffect, useState } from "react";
import { Image, message } from "antd";
import "./SignUpPage.scss";
import { InputForm } from "../../components/InputForm/InputForm";
import imageLogin from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import * as userService from "../../services/userService";
export const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleNavSignIn = () => {
    navigate("/sign-in");
  };
  const handleEye = () => {
    setIsShowPassword(!isShowPassword);
  };
  const handleEyeConfirm = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };
  const handleOnClickSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  const mutation = useMutation({
    mutationFn: (data) => userService.signUp(data),
  });
  const { data } = mutation;
  useEffect(() => {
    if (data && data.errCode === 0) {
      message.success("Sign up success!");
      navigate("/");
    }
  });
  useEffect(() => {
    if (data && data.errCode === 0) {
      message.success("Sign in success!");
      navigate("/");
    }
  });
  return (
    <div className="sign-up-container">
      <div className="sign-up-content">
        <div className="sign-up-left">
          <h1>Xin chào</h1>
          <p>Đăng ký</p>
          <InputForm
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />
          <div className="sign-up-input-password">
            <InputForm
              placeholder="password"
              className="sign-up-password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
            />
            <span onClick={handleEye} className="sign-up-eye">
              {isShowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          <div className="sign-up-input-password">
            <InputForm
              placeholder="confirm password"
              className="sign-up-password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnChangeConfirmPassword}
            />
            <span onClick={handleEyeConfirm} className="sign-up-eye">
              {isShowConfirmPassword ? (
                <EyeOutlined />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </span>
          </div>
          {data?.errCode !== 0 && (
            <span style={{ color: "red" }}>{data?.errMessage}</span>
          )}
          <button className="btn-sign-up" onClick={handleOnClickSignUp}>
            Đăng ký
          </button>
          <p>
            Bạn đã có tài khoản?
            <span onClick={handleNavSignIn}>Đăng nhập</span>
          </p>
        </div>
        <div className="sign-up-right">
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
