import React from "react";
import { HeaderComponent } from "../HeaderComponent/HeaderComponent";

export const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  );
};
