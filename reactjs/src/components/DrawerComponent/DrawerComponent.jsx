import { Drawer } from "antd";
import React from "react";

export const DrawerComponent = ({
  title = "Drawer",
  placement = "right",
  isOpen = false,
  children,
  ...rests
}) => {
  return (
    <Drawer title={title} open={isOpen} placement={placement} {...rests}>
      {children}
    </Drawer>
  );
};
