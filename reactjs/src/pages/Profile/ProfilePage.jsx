import React, { useEffect, useState } from "react";
import { Button, Input, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import * as userService from "../../services/userService";
import "./ProfilePage.scss";
import { getBase64 } from "../../utils";
import { updateUser } from "../../redux/slide/userSlide";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
  });
  const [avatar, setAvatar] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => {
      const { id, access_token, ...rests } = data;
      return userService.updateUser(id, rests, access_token);
    },
    onSuccess: () => {
      message.success("Update success!");
      handleGetDetailsUser(user?.id, user?.access_token);
    },
    onError: () => {
      message.error("Update failed!");
    },
  });

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await userService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleOnChange = (key) => (e) => {
    setProfile({ ...profile, [key]: e.target.value });
  };

  const handleAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview || "");
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      ...profile,
      access_token: user?.access_token,
      avatar,
    });
  };

  return (
    <div className="profile-container">
      <h2>Thông tin người dùng</h2>
      <div className="profile-content">
        {["email", "name", "phone", "address"].map((key) => (
          <div key={key} className="profile-child">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <Input
              placeholder={`Enter your ${key}`}
              value={profile[key]}
              onChange={handleOnChange(key)}
            />
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </div>
        ))}
        <div className="profile-child">
          <label>Avatar</label>
          <Upload onChange={handleAvatar} showUploadList={false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {avatar && (
            <img
              src={avatar}
              alt="avatar"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
            />
          )}
          <Button onClick={handleUpdate}>Cập nhật</Button>
        </div>
      </div>
    </div>
  );
};
