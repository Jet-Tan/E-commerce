import React from "react";
import "./NavbarComponent.scss";
export const NavbarComponent = () => {
  const arrOption = [
    "Nhà Sách Tiki",
    "Nhà Cửa - Đời Sống",
    "Điện Thoại - Máy Tính Bảng",
  ];

  return (
    <div className="nav-container">
      <div className="nav-content">
        <div className="nav-body">
          <div className="title">Danh mục</div>
          <div className="option">
            {arrOption.map((option, index) => {
              return (
                <div className="type" key={index}>
                  <span>{option}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
