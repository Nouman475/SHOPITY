import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  addDoc,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { Modal, Form, Input, Select, InputNumber, Image } from "antd";
import { firestore } from "config/firebase";
import InfiniteScroll from "react-infinite-scroll-component";



const { Option } = Select;

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(firestore, "items");
        const firstQuery = query(productsRef, limit(10));
        const querySnapshot = await getDocs(firstQuery);

        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchMoreData = async () => {
    try {
      setLoading(true)
      const productsRef = collection(firestore, "items");
      const nextQuery = query(productsRef, startAfter(lastVisible), limit(10));
      const querySnapshot = await getDocs(nextQuery);
      
      const moreProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setProducts((prevProducts) => [...prevProducts, ...moreProducts]);
    } catch (error) {
      console.error("Error fetching more products: ", error);
    } finally{
      setLoading(false)
    }
  };

  const handleOrderNow = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let { quantity } = values;
      await addDoc(collection(firestore, "orders"), {
        product: selectedProduct.name,
        orderTo: selectedProduct.createdBy,
        quantity: values.quantity,
        price: selectedProduct.price * quantity,
        ...values,
      });
      window.toastify("Order Placed", "success");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      window.toastify("Something went wrong", "error");
      console.error("Error placing order:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="menu-container container">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner-border text-warning" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreData}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You've seen it all</b>
            </p>
          }
        >
          <div id="card-container">
            {products.map((product, i) => (
              <div id="card" key={i}>
                <div className="card-img">
                  <Image
                    height="100%"
                    width="100%"
                    src={product.imageUrl}
                    alt={product.title}
                    effect="blur"
                  ></Image>
                </div>
                <div className="card-info">
                  <p className="text-title">{product.name}</p>
                  <p className="text-body my-0">{product.description}</p>
                  <p className="text-body my-0">
                    <b>Store id</b>
                  </p>
                  <p className="text-body">{product.id}</p>
                </div>
                <div className="card-footer">
                  <span className="text-title">${product.price}</span>
                  <div className="card-button">
                    <svg
                      className="svg-icon"
                      viewBox="0 0 20 20"
                      onClick={() => handleOrderNow(product)}
                    >
                      <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                      <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                      <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      <Modal
        title="Confirm Your Order"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Home Address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter your home address" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber
              min={1}
              placeholder="Enter quantity"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[
              { required: true, message: "Please select a payment method" },
            ]}
          >
            <Select placeholder="Select a payment method">
              <Option value="googlePay">Google Pay</Option>
              <Option value="Easypaisa">Easypaisa</Option>
              <Option value="JazzCash">JazzCash</Option>
              <Option value="visa">Visa</Option>
              <Option value="HBL">HBL Bank</Option>
              <Option value="Cash on delivery">Cash on Delivery</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Menu;
