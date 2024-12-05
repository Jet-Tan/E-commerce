import React, { useState } from "react";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { HeaderComponent } from "../../components/HeaderComponent/HeaderComponent";
import "./AdminPage.scss";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";

export const AdminPage = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const items = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
    {
      key: "product",
      icon: <AppstoreOutlined />,
      label: "Sản phẩm",
    },
  ];
  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      default:
        return <></>;
    }
  };
  const handleClick = ({ key }) => {
    setSelectedKey(key);
  };
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div className="menu-container">
        <div className="menu-left">
          <Menu mode="inline" items={items} onClick={handleClick} />
        </div>

        <div className="menu-right">
          <div>{renderPage(selectedKey)}</div>
        </div>
      </div>
    </>
  );
};
