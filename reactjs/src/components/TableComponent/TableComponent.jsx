import { useState } from "react";
import React from "react";
import { Table } from "antd";

export const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    columns = [],
    handleDeleteMany,
  } = props;
  const [rowSelectedKey, setRowSelectedKey] = useState("");
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKey(selectedRowKeys);
    },
  };
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey);
  };
  return (
    <div>
      {rowSelectedKey && rowSelectedKey.length > 0 && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Delete all
        </div>
      )}

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </div>
  );
};
