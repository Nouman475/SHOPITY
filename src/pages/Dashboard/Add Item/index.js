import React, { useState } from "react";
import { Card, Typography, Input, Button, Upload, Image, Spin } from "antd";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "config/firebase";

const Add = () => {
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const auth = getAuth();
  const storage = getStorage();

  const handleUploadChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `images/${file.name}`);

      setUploading(true); // Show spinner
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setImageUrl(url);
        setUploading(false); // Hide spinner
      } catch (error) {
        setUploading(false); // Hide spinner
        window.toastify("Error uploading file", "error");
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleAddItem = async () => {
    if (!auth.currentUser) {
      window.toastify("No user is signed in", "error");
      return;
    }

    if (!imageUrl) {
      window.toastify("Image URL not set yet", "error");
      return;
    }

    const uid = auth.currentUser.uid;

    try {
      await addDoc(collection(firestore, "items"), {
        name: itemName,
        price: price,
        description: description,
        imageUrl: imageUrl,
        createdBy: uid,
      });
      window.toastify("Item added successfully", "success");

      // Reset form
      setFileList([]);
      setImageUrl("");
      setItemName("");
      setPrice("");
      setDescription("");
    } catch (error) {
      window.toastify("Error adding item", "error");
      console.error("Error adding item:", error);
    }
  };

  return (
    <Card
      style={{
        boxShadow:
          "rgba(208, 184, 144, 0.83) 0px 30px 60px -12px inset, rgba(228, 161, 36, 0.955) 0px 18px 36px -18px inset",
        backgroundColor: "#d4660c",
        color: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "100%",
        margin: "20px auto",
      }}
    >
      <Typography.Title level={1} style={{ color: "#fff" }}>
        Add Item
      </Typography.Title>
      <Input
        placeholder="Item Name"
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
        }}
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <Input
        placeholder="Price"
        type="number"
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
        }}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input
        placeholder="Description"
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
        }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Upload
        style={{ width: "100%" }}
        listType="picture-card"
        fileList={fileList}
        onChange={handleUploadChange}
        accept=".jpg, .jpeg, .png"
        beforeUpload={() => false}
      >
        {fileList.length < 1 && "+ Upload"}
      </Upload>
      {uploading && <Spin tip="Uploading..." />}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Uploaded Image"
          style={{ width: "100px", height: "100px", margin: "10px" }}
          onClick={() => {
            window.open(imageUrl);
          }}
        />
      )}
      <Button
        type="primary"
        style={{
          backgroundColor: "#000",
          width: "100%",
          margin: "10px 0px",
        }}
        onClick={handleAddItem}
      >
        Add Item
      </Button>
    </Card>
  );
};

export default Add;
