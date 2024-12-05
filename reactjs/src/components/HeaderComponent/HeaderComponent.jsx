import React, { useEffect, useState } from "react";
import { Row, Col, Badge, Popover } from "antd";
import { Input } from "antd";
import {
  HomeFilled,
  SmileOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./HeaderComponent.scss";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "../../services/userService";
import { resetUser } from "../../redux/slide/userSlide";
import { searchProduct } from "../../redux/slide/productSlide";
import * as productService from "../../services/productService";
import { TypeProduct } from "../TypeProduct/TypeProduct";
const { Search } = Input;

export const HeaderComponent = ({
  isHiddenSearch = false,
  isHiddenCart = false,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatart, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const order = useSelector((state) => state.order);
  const [typeProducts, setTypeProducts] = useState([]);
  const handleNavLogin = () => {
    navigate("/sign-in");
  };
  const handleLogout = async () => {
    await userService.logoutUser();
    dispatch(resetUser());
  };
  useEffect(() => {
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
  }, [user?.name, user?.avatar]);
  const content = (
    <div className="header-account">
      <div className="infor-user" onClick={() => navigate("profile-user")}>
        Thông tin người dùng
      </div>
      {user?.isAdmin && (
        <div className="admin" onClick={() => navigate("/system/admin")}>
          Quản lý hệ thống
        </div>
      )}
      <div className="header-logout" onClick={handleLogout}>
        Đăng xuất
      </div>
    </div>
  );
  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  const fetchGetAllType = async () => {
    const res = await productService.getAllType();
    if (res?.errCode === 0) {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchGetAllType();
  }, []);
  return (
    <>
      <div className="header-containers">
        <div className="header-content">
          <Row gutter={16}>
            <Col span={4} className="content-left">
              <img
                className="header-logo"
                src={logo}
                alt="Logo"
                onClick={() => navigate("/")}
              />
              <span>Tốt & Nhanh</span>
            </Col>
            {!isHiddenSearch && (
              <Col span={14} className="content-center">
                <Search
                  placeholder="Bạn tìm gì hôm nay"
                  allowClear
                  enterButton="Search"
                  size="large"
                  onChange={onSearch}
                />
                <div className="title">
                  {typeProducts?.length > 0 &&
                    typeProducts.map((type, index) => {
                      return <TypeProduct key={index} name={type} />;
                    })}
                </div>
              </Col>
            )}

            <Col span={6} className="content-right">
              <div className="home" onClick={() => navigate("/")}>
                <HomeFilled />
                <span>Trang chủ</span>
              </div>
              {user?.access_token ? (
                <Popover content={content} trigger="click">
                  <div className="account">
                    {userAvatart && userAvatart.length > 0 ? (
                      <img
                        src={userAvatart}
                        alt="avatar"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <SmileOutlined />
                    )}

                    <span>
                      {userName && userName.length > 0 ? userName : "User"}
                    </span>
                  </div>
                </Popover>
              ) : (
                <div className="account" onClick={handleNavLogin}>
                  <SmileOutlined />
                  <span>Tài khoản</span>
                </div>
              )}
              {!isHiddenCart && (
                <div className="header-card" onClick={() => navigate("/order")}>
                  <Badge
                    count={order?.orderItems?.length}
                    style={{ margin: "5px" }}
                    size="small"
                  >
                    <div className="card-child">
                      <ShoppingCartOutlined />
                    </div>
                  </Badge>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      {!isHiddenCart && !isHiddenSearch ? (
        <div className="header-ship">
          <h3>30 Ngày đổi ý & miễn phí trả hàng</h3>
        </div>
      ) : (
        <div className="header-ship"></div>
      )}
    </>
  );
};
