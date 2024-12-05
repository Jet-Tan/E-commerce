import React, { useEffect, useState, useRef } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Upload, Form, Input, message, Space, Select } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TableComponent } from "../TableComponent/TableComponent";

import { getBase64, renderOptions } from "../../utils";
import "./AdminProduct.scss";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import * as productService from "../../services/productService";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { SearchOutlined } from "@ant-design/icons";
// import Highlighter from "react-highlight-words";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [formDrawer] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    newType: "",
  });
  const [stateProductDetail, setStateProductDetail] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    description: "",
    rating: "",
    image: "",
  });
  // Mutation for creating a product
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await productService.createProduct(data);
      return res;
    },
  });

  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.errCode === 0) {
      message.success("Create success!");
      handleCancel();
    } else if (isError) {
      message.error("Create failed!");
    }
  }, [isSuccess, isError, data]);

  // Query for fetching all products
  const getAllProduct = async () => {
    const res = await productService.getAllProduct("", 10);
    return res;
  };

  const fetchGetAllType = async () => {
    const res = await productService.getAllType();
    return res;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: products } = queryProduct;

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchGetAllType,
  });
  // Show the modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal OK
  const handleOk = () => {
    onFinish();
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setStateProduct({
      name: "",
      type: "",
      countInStock: "",
      price: "",
      description: "",
      rating: "",
      image: "",
    });
  };

  // Handle form finish
  const onFinish = () => {
    const param = {
      name: stateProduct.name,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
    };
    mutation.mutate(param, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  // Handle input change
  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeDetail = (e) => {
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value,
    });
  };
  // Handle avatar upload
  const handleAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };
  const handleAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetail({
      ...stateProductDetail,
      image: file.preview,
    });
  };
  const fetchGetDetailProduct = async () => {
    const res = await productService.getDetailProduct(rowSelected);
    if (res?.data) {
      setStateProductDetail({
        name: res?.data?.name,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
      });
    }
  };

  useEffect(() => {
    formDrawer.setFieldsValue(stateProductDetail);
  }, [formDrawer, stateProductDetail]);
  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailProduct(rowSelected);
    }
  }, [rowSelected]);

  // Handle edit button click
  const handleOnClickEdit = () => {
    setIsOpenDrawer(true);
  };
  const mutationUpdate = useMutation({
    mutationFn: async (data) => {
      const { id, token, ...rests } = data;
      const res = await productService.updateProduct(id, { ...rests }, token);
      return res;
    },
  });
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetail,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const {
    isError: isErrorUpdate,
    isSuccess: isSuccessUpdate,
    isLoading: isLoadingUpdated,
  } = mutationUpdate;
  useEffect(() => {
    if (isSuccessUpdate) {
      message.success("Update success");
      handleCloseDrawer();
    } else if (isErrorUpdate) {
      message.error("Update failed");
    }
  }, [isErrorUpdate, isSuccessUpdate]);
  const mutationDelete = useMutation({
    mutationFn: async (data) => {
      const { id, token } = data;
      const res = await productService.deleteProduct(id, token);
      return res;
    },
  });
  const { isError: isErrorDelete, isSuccess: isSuccessDelete } = mutationDelete;
  useEffect(() => {
    if (isSuccessDelete) {
      message.success("Delete success!");
      handleCancelDetele();
    } else if (isErrorDelete) {
      message.error("Delete failed!");
    }
  }, [isErrorDelete, isSuccessDelete]);
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };
  const handleOkDetele = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const handleCancelDetele = () => {
    setIsModalDelete(false);
  };

  const mutationDeleteMany = useMutation({
    mutationFn: async (data) => {
      const { token, ...ids } = data;
      const res = await productService.deleteAllProduct(ids, token);
      return res;
    },
  });
  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const {
    isError: isErrorDeleteManyProduct,
    isSuccess: isSuccessDeleteManyProduct,
  } = mutationDeleteMany;
  useEffect(() => {
    if (isSuccessDeleteManyProduct) {
      message.success("Delete success");
    } else if (isErrorDeleteManyProduct) {
      message.error("Delete failed");
    }
  }, [isSuccessDeleteManyProduct, isErrorDeleteManyProduct]);
  // Render action buttons
  const renderAction = () => (
    <div className="action-product">
      <div className="delete-product">
        <DeleteOutlined onClick={() => setIsModalDelete(true)} />
      </div>
      <div className="edit-product">
        <EditOutlined onClick={handleOnClickEdit} />
      </div>
    </div>
  );
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: "Price >= 50",
          value: ">=",
        },
        {
          text: "Price <= 50",
          value: "<=>",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        } else {
          return record.price <= 50;
        }
      },
    },
    {
      title: "Count in stock",
      dataIndex: "countInStock",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: "Price >= 3",
          value: ">=",
        },
        {
          text: "Price <= 3",
          value: "<=>",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 3;
        } else {
          return record.rating <= 3;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  // Map product data for table
  const dataTable = products?.data?.data?.map((product) => ({
    ...product,
    key: product._id,
  }));
  return (
    <div className="admin-product-container">
      <h2>Quản lý sản phẩm</h2>
      <Button className="admin-product-btn" onClick={showModal}>
        <PlusOutlined />
      </Button>
      <div className="admin-product-table">
        <TableComponent
          handleDeleteMany={handleDeleteManyProduct}
          data={dataTable}
          columns={columns}
          onRow={(record) => ({
            onClick: () => {
              setRowSelected(record._id);
            },
          })}
        />
      </div>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              value={stateProduct.name}
              onChange={handleOnChange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select
              name="type"
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>
          {stateProduct.type === "add_type" && (
            <Form.Item
              label="New type"
              name="newType"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Input
                value={stateProduct.newType}
                onChange={handleOnChange}
                name="newType"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Count inStock"
            name="countInStock"
            rules={[
              { required: true, message: "Please input your count inStock!" },
            ]}
          >
            <Input
              value={stateProduct.countInStock}
              onChange={handleOnChange}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input your price!" }]}
          >
            <Input
              value={stateProduct.price}
              onChange={handleOnChange}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input
              value={stateProduct.description}
              onChange={handleOnChange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please input your rating!" }]}
          >
            <Input
              value={stateProduct.rating}
              onChange={handleOnChange}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input your image!" }]}
          >
            <Upload
              onChange={handleAvatar}
              showUploadList={false}
              maxCount={1}
              name="image"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {stateProduct.image && (
              <img
                src={stateProduct.image}
                alt="product"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  marginLeft: "40px",
                }}
              />
            )}
          </Form.Item>
        </Form>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="50%"
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600 }}
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={formDrawer}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              value={stateProductDetail.name}
              onChange={handleOnChangeDetail}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Input
              value={stateProductDetail.type}
              onChange={handleOnChangeDetail}
              name="type"
            />
          </Form.Item>
          <Form.Item
            label="Count inStock"
            name="countInStock"
            rules={[
              { required: true, message: "Please input your count inStock!" },
            ]}
          >
            <Input
              value={stateProductDetail.countInStock}
              onChange={handleOnChangeDetail}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input your price!" }]}
          >
            <Input
              value={stateProductDetail.price}
              onChange={handleOnChangeDetail}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input
              value={stateProductDetail.description}
              onChange={handleOnChangeDetail}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please input your rating!" }]}
          >
            <Input
              value={stateProductDetail.rating}
              onChange={handleOnChangeDetail}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input your image!" }]}
          >
            <Upload
              onChange={handleAvatarDetail}
              showUploadList={false}
              maxCount={1}
              name="image"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {stateProductDetail.image && (
              <img
                src={stateProductDetail.image}
                alt="product"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  marginLeft: "40px",
                }}
              />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        isOpen={isModalDelete}
        onOk={handleOkDetele}
        onCancel={handleCancelDetele}
      >
        <div></div>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
