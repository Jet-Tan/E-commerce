import React from "react";
import "./OrderPage.scss";
import { Checkbox, InputNumber } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { decreaseAmount, increaseAmount } from "../../redux/slide/orderSlide";
export const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const hadnleOnChangeCheckAll = (e) => {};
  const onChange = (e) => {
    console.log(e.target.value);
  };

  const handleChangeCount = (type, idProduct) => {
    if (type === "increase") {
      dispatch(increaseAmount(idProduct));
    } else {
      dispatch(decreaseAmount(idProduct));
    }
  };
  console.log("check", order);
  return (
    <div className="order-container">
      <div className="order-content">
        <span>Giỏ hàng</span>
        <div className="order-body">
          <div className="order-left">
            <div className="order-up">
              <div className="header-up">
                <Checkbox onChange={hadnleOnChangeCheckAll}>
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </Checkbox>
              </div>
              <div className="header-down">
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined />
              </div>
            </div>
            {order?.orderItems?.map((order) => {
              return (
                <div className="order-down">
                  <div className="list-up">
                    <Checkbox />
                    <img src="aa" />
                    <span>{order?.name}</span>
                  </div>
                  <div className="list-down">
                    <div className="price">{order?.price}</div>
                    <div className="amount">
                      <button
                        onClick={() =>
                          handleChangeCount("decrease", order?.product)
                        }
                      >
                        <MinusOutlined />
                      </button>
                      <InputNumber
                        min={1}
                        max={10}
                        defaultValue={order?.amount}
                        value={order?.amount}
                        onChange={onChange}
                        size="small"
                        className="input-number"
                      />

                      <button
                        onClick={() =>
                          handleChangeCount("increase", order?.product)
                        }
                      >
                        <PlusOutlined />
                      </button>
                    </div>
                    <div className="into-money">
                      {order?.price * order?.amount}
                    </div>
                    <DeleteOutlined />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="order-right">
            <div className="order-right-content">
              <div className="order-infor">
                <div className="provisional">
                  <span>Tạm tính</span>
                  <span>0</span>
                </div>
                <div className="discount">
                  <span>Giảm giá</span>
                  <span>0</span>
                </div>
                <div className="tax">
                  <span>Thuế</span>
                  <span>0</span>
                </div>
                <div className="delivery-charges">
                  <span>Phí giao hàng</span>
                  <span>0</span>
                </div>
              </div>
              <div className="order-total">
                <div>Tổng tiền</div>
                <div className="total">
                  <div className="number-total">123</div>
                  <span>(Đã bao gồm VAT nếu có)</span>
                </div>
              </div>
            </div>
            <button>Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};
