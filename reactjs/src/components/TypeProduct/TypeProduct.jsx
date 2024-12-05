import React from "react";
import { useNavigate } from "react-router-dom";

export const TypeProduct = ({ name }) => {
  const navigate = useNavigate();

  const handleNavType = (type) => {
    const encodedType = type
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      ?.replace(/ /g, "_");
    navigate(`/product/${encodedType}`, { state: type });
  };

  return <div onClick={() => handleNavType(name)}>{name}</div>;
};
