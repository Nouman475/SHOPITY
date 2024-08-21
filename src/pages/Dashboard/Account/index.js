import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Divider,
  Button,
  Row,
  Col,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "config/firebase";
import { useAuthContext } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Account.css";

export default function Account() {
  const [user, setUser] = useState({ fullName: "", email: "", uid: "" });

  const auth = getAuth();
  const { dispatch } = useAuthContext();
  let navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUserData(currentUser.uid);
      } else {
        console.log("User not found");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const getUserData = async (id) => {
    try {
      const docRef = doc(firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "SET_LOGGED_OUT" });
      window.toastify("Logged out successfully", "success");
      navigate('/auth/login');
    } catch (error) {
      console.error("Error logging out:", error);
      window.toastify("Error logging out", "error");
    }
  };

  return (
    <Row justify="center" style={{ padding: "20px" }}>
      <Col xs={24} md={16} lg={12}>
        <Card className="account-card">
          <Space direction="vertical" size={20} align="center">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="account-avatar"
            />
            <Typography.Title level={3} className="account-title">
              {user.fullName}
            </Typography.Title>
            <Typography.Text className="account-text">
              {user.email}
            </Typography.Text>
          </Space>
          <Divider className="account-divider" />
          <Space direction="vertical" size={10} align="center">
            <Typography.Text className="account-info">
              Profile Information
            </Typography.Text>
            <Typography.Text className="account-info">
              Seller | Food Enthusiast | Business Chick | Sugar Craver
            </Typography.Text>
            <Typography.Text className="account-info">
              Your ID: {user.uid}
            </Typography.Text>
          </Space>
          <Button
            type="primary"
            size="large"
            icon={<LogoutOutlined />}
            className="account-logout-button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Card>
      </Col>
    </Row>
  );
}
