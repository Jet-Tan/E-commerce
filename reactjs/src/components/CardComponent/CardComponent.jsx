import React from "react";
import "./CardComponent.scss";
import { Card } from "antd";
import { CheckCircleFilled, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export const CardComponent = (props) => {
  const {
    countInStock,
    image,
    description,
    price,
    type,
    rating,
    name,
    discount,
    selled,
    productId,
  } = props;
  const navigate = useNavigate();

  const handleDetailProduct = (productId) => {
    navigate(`/product-detail/${productId}`);
  };
  return (
    <div
      className="card-container"
      onClick={() => handleDetailProduct(productId)}
    >
      <Card
        hoverable
        style={{
          width: 180,
        }}
        cover={<img alt="example" src={image} style={{ height: "170px" }} />}
      >
        <div className="card-content">
          <div className="badge">
            <span>
              <CheckCircleFilled />
              Chính hãng
            </span>
          </div>
          <div className="info">
            <span className="title">{name}</span>
            <span className="star">
              {rating}
              <StarFilled />
            </span>
          </div>
          <div className="price">
            <span>{price}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
