import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase";
import { Table, Spin, Badge, Button } from "antd";
import { useAuthContext } from "contexts/AuthContext";

const Order = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, "orders"),
          where("orderTo", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        window.toastify("Something went wrong, or Network anomaly", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleComplete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "orders", id));
      setOrders(orders.filter((order) => order.id !== id));
      window.toastify("Order marked as completed and deleted", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      window.toastify("Failed to mark order as completed", "error");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Product Name",
      dataIndex: "product",
      key: "productName",
      width: 150,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Total Price ($)",
      dataIndex:"price" ,
      key: "totalPrice",
      width: 120,
    },
    {
      title: "Customer Email",
      dataIndex: "email",
      key: "customerEmail",
      width: 180,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 220,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Badge
          status={record.completed ? "success" : "processing"}
          text={record.completed ? "Completed" : "Pending"}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) =>
        !record.completed && (
          <Button
            type="primary"
            danger
            onClick={() => handleComplete(record.id)}
          >
            Mark as Completed
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            size="small"
          />
        </div>
      )}
    </div>
  );
};

export default Order;
