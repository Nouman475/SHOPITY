import React, { useState, useEffect } from "react";
import Account from "../Account/index";
import Add from "../Add Item/index";
import All from "../All Items/index";
import {
  PlusSquareOutlined,
  PieChartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Order from "../Orders/order";

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("All products", "1", <PieChartOutlined />),
  getItem("Add new Item", "2", <PlusSquareOutlined />),
  getItem("You", "3", <UserOutlined />),
  getItem('Orders', '4', <ShoppingCartOutlined />),
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("1");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaQueryChange = (e) => setCollapsed(e.matches);
    setCollapsed(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleMenuClick = (e) => {
    setActiveMenu(e.key);
  };

  return (
    <main>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{ backgroundColor: "#000" }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu
            style={{ backgroundColor: "#000" }}
            theme="dark"
            selectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ backgroundColor: "#ffff" }}>
          <Content style={{ margin: "0 16px" }}>
            <div style={{ minHeight: 36 }}>
              {activeMenu === "1" && <All />}
              {activeMenu === "2" && <Add />}
              {activeMenu === "3" && <Account />}
              {activeMenu === '4' && <Order />}
            </div>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
