import React, { useState } from "react";
import { Input } from "antd";
import "./InputForm.scss";
export const InputForm = (props) => {
  const { placeholder = "Nhập text", ...rest } = props;
  const handleOnChangeInput = (e) => {
    props.onChange(e.target.value);
  };
  return (
    <div className="input-form">
      <Input
        className="btn-input"
        placeholder={placeholder}
        value={props.value}
        {...rest}
        onChange={handleOnChangeInput}
      />
    </div>
  );
};
