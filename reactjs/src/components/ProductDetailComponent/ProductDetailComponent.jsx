import { Col, Row, Image, InputNumber, Rate } from "antd";
import React, { useState } from "react";
import "./ProductDetailComponent.scss";
import imageProductSmall from "../../assets/product/1_small.jpg";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slide/orderSlide";
export const ProductDetailComponent = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  const [numProduct, setNumProduct] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const onChange = (e) => {
    if (e && e.target) {
      setNumProduct(Number(e.target.value));
    }
  };
  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else {
      setNumProduct(numProduct - 1);
    }
  };
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await productService.getDetailProduct(id);
      return res.data;
    }
  };

  const { data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });
  console.log("cha", location);
  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItems: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
          },
        })
      );
    }
  };
  console.log("check", productDetails, user);
  return (
    <Row className="product-detail-component">
      <Col span={10} className="product-detail-image">
        <div className="image-detail">
          <Image src={productDetails?.image} alt="image product" />
        </div>

        <Row className="image-small-content">
          <Col span={4} className="image-small-detail">
            <Image
              src={imageProductSmall}
              alt="image small"
              className="image-small-child"
            />
          </Col>
          <Col span={4} className="image-small-detail">
            <Image
              src={imageProductSmall}
              alt="image small"
              className="image-small-child"
            />
          </Col>
          <Col span={4} className="image-small-detail">
            <Image
              src={imageProductSmall}
              alt="image small"
              className="image-small-child"
            />
          </Col>
          <Col span={4} className="image-small-detail">
            <Image
              src={imageProductSmall}
              alt="image small"
              className="image-small-child"
            />
          </Col>
          <Col span={4} className="image-small-detail">
            <Image
              src={imageProductSmall}
              alt="image small"
              className="image-small-child"
            />
          </Col>
          <Col span={4} className="image-small-detail">
            <Image
              src={imageProductSmall}
              alt="image small"
              className="image-small-child"
            />
          </Col>
        </Row>
      </Col>
      <Col span={14} className="product-detail-content">
        <div className="title-product-detail">{productDetails?.name}</div>
        <div className="product-detail-rating">
          <div className="product-detail-star">
            <Rate allowHalf defaultValue={productDetails?.rating} />
          </div>
          <span className="text-sell">Đã bán 5000+</span>
        </div>
        <div className="price">{productDetails?.price}</div>
        <div className="address-product">
          <span>Giao đến</span>
          <span className="address">{user?.address}</span>
          <span className="change-address">Đổi địa chỉ</span>
        </div>
        <div className="quantity-content">
          <div>Số lượng</div>
          <div className="quality-product">
            <button onClick={() => handleChangeCount("decrease")}>
              <MinusOutlined />
            </button>

            <InputNumber
              className="input-number"
              size="small"
              value={numProduct}
              onChange={onChange}
            />
            <button onClick={() => handleChangeCount("increase")}>
              <PlusOutlined />
            </button>
          </div>
        </div>
        <div className="buy-product">
          <button className="btn-buy" onClick={() => handleAddOrderProduct()}>
            Mua ngay
          </button>
          <button className="btn-pay-later">Mua trả sau</button>
        </div>
      </Col>
    </Row>
  );
};
