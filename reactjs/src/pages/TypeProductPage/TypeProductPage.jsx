import React, { useEffect, useState } from "react";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { NavbarComponent } from "../../components/NavbarComponent/NavbarComponent";
import { Row, Col } from "antd";
import "./TypeProductPage.scss";
import { Pagination } from "antd";
import * as productService from "../../services/productService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export const TypeProductPage = () => {
  const { state } = useLocation();
  const searchProduct = useSelector((state) => state?.product?.search);
  const [products, setProducts] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });
  const fetchProductType = async (type, page, limit) => {
    const res = await productService.getProductType(type, page, limit);
    console.log("cha", res);
    if (res?.data?.errCode === 0) {
      setProducts(res?.data?.data);
      setPagination({ ...pagination, total: res?.data?.totalPage });
    }
  };
  useEffect(() => {
    if (state) {
      fetchProductType(state, pagination.page, pagination.limit);
    }
  }, [state, pagination.page, pagination.limit]);
  const onChange = (current, pageSize) => {
    setPagination({ ...pagination, page: current - 1, limit: pageSize });
  };

  return (
    <div className="type-container">
      <Row gutter={16}>
        <Col span={5}>
          <NavbarComponent />
        </Col>

        <Col span={19}>
          <div className="type-card-content">
            {products?.length > 0 &&
              products
                .filter((pro) => {
                  if (searchProduct === "") {
                    return true; // Return all products if searchProduct is empty
                  } else if (
                    pro?.name
                      ?.toLowerCase()
                      ?.includes(searchProduct?.toLowerCase())
                  ) {
                    return true; // Return products that match the search term
                  }
                  return false; // Exclude products that do not match the search term
                })
                .map((product) => {
                  return (
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
                  );
                })}
          </div>
          <div className="type-pagination">
            <Pagination
              defaultCurrent={pagination.page + 1}
              total={pagination.total}
              onChange={onChange}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
