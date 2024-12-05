import React from "react";
import { Button, Modal } from "antd";
export const ModalComponent = ({
  title = "modal",
  isOpen = false,
  children,
  ...rests
}) => {
  return (
    <Modal title={title} open={isOpen} {...rests}>
      {children}
    </Modal>
  );
};
