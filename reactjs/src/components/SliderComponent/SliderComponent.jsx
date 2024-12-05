import React from "react";
import Slider from "react-slick";
import "./SliderComponent.scss";
import { Image } from "antd";

export const SliderComponent = ({ settings, arrImage }) => {
  return (
    <div className="slider-container">
      <div className="slider-content">
        <div className="slider-body">
          <Slider {...settings}>
            {arrImage &&
              arrImage.length > 0 &&
              arrImage.map((image, index) => {
                return (
                  <div key={index} className="slider-image">
                    <Image src={image} alt="slider" preview={false} />
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    </div>
  );
};
