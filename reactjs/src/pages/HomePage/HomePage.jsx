import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SliderComponent } from "../../components/SliderComponent/SliderComponent";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { NavbarComponent } from "../../components/NavbarComponent/NavbarComponent";
import { Row, Col } from "antd";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import slider1 from "../../assets/slide/slider1.png";
import slider2 from "../../assets/slide/slider2.png";
import slider3 from "../../assets/slide/slider3.png";
import slider4 from "../../assets/slide/slider4.png";
import slider5 from "../../assets/slide/slider5.png";
import slider6 from "../../assets/slide/slider6.png";
import "./HomePage.scss";
import { useSelector } from "react-redux";

export const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  };
  const searchProduct = useSelector((state) => state?.product?.search);
  const [limit, setLimit] = useState(6);
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await productService.getAllProduct(search, limit);
    return res;
  };

  const { data: products } = useQuery({
    queryKey: ["products", limit, searchProduct],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  return (
    <div className="home-page-container">
      <Row gutter={16}>
        <Col span={5}>
          <NavbarComponent />
        </Col>
        <Col span={19}>
          <SliderComponent
            settings={settings}
            arrImage={[slider1, slider2, slider3, slider4, slider5, slider6]}
          />
          <div className="card">
            {products?.data?.data?.length > 0 ? (
              products.data.data.map((product) => (
                <CardComponent
                  key={product._id}
                  image={product.image}
                  countInStock={product.countInStock}
                  description={product.description}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  name={product.name}
                  productId={product._id}
                />
              ))
            ) : (
              <div>No products available</div>
            )}
          </div>
          <div className="extra-btn">
            {products?.data?.total === products?.data?.data.length ||
            products?.data?.totalPage === 1 ? (
              <button disabled hidden>
                Xem thêm
              </button>
            ) : (
              <button onClick={() => setLimit((prev) => prev + 6)}>
                Xem thêm
              </button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};
