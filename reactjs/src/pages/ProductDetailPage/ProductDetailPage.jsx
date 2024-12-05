import React from "react";
import "./ProductDetailPage.scss";
import { ProductDetailComponent } from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";
export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="product-detail-page">
      <div className="title">
        <span onClick={() => navigate("/")}>Trang chủ</span> - Chi tiết sản phẩm
      </div>
      <ProductDetailComponent idProduct={id} />
    </div>
  );
};
