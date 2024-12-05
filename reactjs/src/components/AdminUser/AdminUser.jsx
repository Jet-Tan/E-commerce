import React, { useEffect, useState, useRef } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Upload, Form, Input, message, Space } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TableComponent } from "../TableComponent/TableComponent";

import { getBase64 } from "../../utils";
import "./AdminUser.scss";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import * as userService from "../../services/userService";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { SearchOutlined } from "@ant-design/icons";
// import Highlighter from "react-highlight-words";

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [formDrawer] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    isAdmin: false,
  });
  // Mutation for creating a User
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await userService.signUp(data);
      return res;
    },
  });

  const { data, isSuccess: isSuccessCreate, isError: isErrorCreate } = mutation;

  useEffect(() => {
    if (isSuccessCreate && data?.errCode === 0) {
      message.success("Create success!");
      handleCancel();
    } else if (isErrorCreate) {
      message.error("Create failed!");
    }
  }, [isSuccessCreate, isErrorCreate, data]);

  // Query for fetching all Users
  const getAllUser = async () => {
    const res = await userService.getAllUser();
    return res;
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
    retry: 3,
    retryDelay: 1000,
  });
  const { data: users } = queryUser;

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
    setStateUser({
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Handle form finish
  const onFinish = () => {
    mutation.mutate(stateUser, {
      onSettled: () => {
        queryUser.refetch();
      },
    });
  };

  // Handle input change
  const handleOnChange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value,
    });
  };
  // Handle avatar upload
  const handleAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUser({
      ...stateUser,
      avatar: file.preview,
    });
  };
  const handleAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetail({
      ...stateUserDetail,
      avatar: file.preview,
    });
  };
  const fetchGetDetailUser = async () => {
    const res = await userService.getDetailUser(rowSelected);
    if (res?.data) {
      setStateUserDetail({
        name: res?.data?.data?.name,
        email: res?.data?.data?.email,
        phone: res?.data?.data?.phone,
        address: res?.data?.data?.address,
        avatar: res?.data?.data?.avatar,
      });
    }
  };
  useEffect(() => {
    formDrawer.setFieldsValue(stateUserDetail);
  }, [formDrawer, stateUserDetail]);
  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailUser(rowSelected);
    }
  }, [rowSelected]);

  // Handle edit button click
  const handleOnClickEdit = () => {
    setIsOpenDrawer(true);
  };
  const mutationUpdate = useMutation({
    mutationFn: async (data) => {
      const { id, token, ...rests } = data;
      const res = await userService.updateUser(id, { ...rests }, token);
      return res;
    },
  });
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetail,
      },
      {
        onSettled: () => {
          queryUser.refetch();
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
      const res = await userService.deleteUser(id, token);
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
          queryUser.refetch();
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
      const res = await userService.deleteAllUser(ids, token);
      return res;
    },
  });
  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const { isError: isErrorDeleteManyUser, isSuccess: isSuccessDeleteManyUser } =
    mutationDeleteMany;
  useEffect(() => {
    if (isSuccessDeleteManyUser) {
      message.success("Delete success");
    } else if (isErrorDeleteManyUser) {
      message.error("Delete failed");
    }
  }, [isSuccessDeleteManyUser, isErrorDeleteManyUser]);
  // Render action buttons
  const renderAction = () => (
    <div className="action-user">
      <div className="delete-user">
        <DeleteOutlined onClick={() => setIsModalDelete(true)} />
      </div>
      <div className="edit-user">
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  // Map User data for table
  const dataTable = users?.data?.data?.map((user) => ({
    ...user,
    key: user._id,
  }));

  return (
    <div className="admin-user-container">
      <h2>Quản lý người dùng</h2>
      <Button className="admin-user-btn" onClick={showModal}>
        <PlusOutlined />
      </Button>
      <div className="admin-user-table">
        <TableComponent
          handleDeleteMany={handleDeleteManyUser}
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
        title="Tạo người dùng"
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
              value={stateUser.name}
              onChange={handleOnChange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={stateUser.email}
              onChange={handleOnChange}
              name="email"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input
              value={stateUser.email}
              onChange={handleOnChange}
              name="password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your Confirm password!",
              },
            ]}
          >
            <Input
              value={stateUser.email}
              onChange={handleOnChange}
              name="confirmPassword"
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your count phone!" },
            ]}
          >
            <Input
              value={stateUser.phone}
              onChange={handleOnChange}
              name="phone"
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input
              value={stateUser.address}
              onChange={handleOnChange}
              name="address"
            />
          </Form.Item>
          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: "Please input your avatar!" }]}
          >
            <Upload
              onChange={handleAvatar}
              showUploadList={false}
              maxCount={1}
              name="avatar"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {stateUser.avatar && (
              <img
                src={stateUser.avatar}
                alt="User"
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
          onFinish={onUpdateUser}
          autoComplete="on"
          form={formDrawer}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              value={stateUserDetail.name}
              onChange={handleOnChangeDetail}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={stateUserDetail.email}
              onChange={handleOnChangeDetail}
              name="email"
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your count phone!" },
            ]}
          >
            <Input
              value={stateUserDetail.phone}
              onChange={handleOnChangeDetail}
              name="phone"
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input
              value={stateUserDetail.address}
              onChange={handleOnChangeDetail}
              name="address"
            />
          </Form.Item>
          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: "Please input your avatar!" }]}
          >
            <Upload
              onChange={handleAvatarDetail}
              showUploadList={false}
              maxCount={1}
              name="avatar"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {stateUserDetail.avatar && (
              <img
                src={stateUserDetail.avatar}
                alt="user"
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
        title="Xóa người dùng"
        isOpen={isModalDelete}
        onOk={handleOkDetele}
        onCancel={handleCancelDetele}
      >
        <div></div>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
