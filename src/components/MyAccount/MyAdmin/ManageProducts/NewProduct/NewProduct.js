import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../../../../../common/http";

const NewProduct = () => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);

  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = new FormData();
    const storedToken = localStorage.getItem("authToken");

    body.append("sku", sku);
    body.append("quantity", quantity);
    body.append("name", name);
    body.append("price", price);
    body.append("brand", brand);
    body.append("description", description);
    body.append("category", category);
    body.append("imageUrl", image);

    axiosInstance
      .post(`/api/products/create`, body, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        e.target.reset();
        history.push("/shop");
      })
      .catch((err) => {
        // const errorDescription = error.response.data.message;
        // setErrorMessage(errorDescription);
      });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    const getCategories = () => {
      axiosInstance
        .get("/api/categories", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          setCategories(response.data);
          setCategory(response.data[0]._id);
        })
        .catch((err) => {});
    };
    getCategories();
  }, []);

  return (
    <div>
      <section
        className="container d-flex flex-column justify-content-center align-items-center"
        id="create-product"
      >
        <div className="create-product-wrapper">
          <h2 className="text-center text-muted text-uppercase">New product</h2>

          <div className="create-product-container">
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-column">
                <label htmlFor="sku">Sku:</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  onChange={(e) => setSku(e.target.value)}
                />
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  step="any"
                  id="price"
                  name="price"
                  onChange={(e) => setPrice(e.target.value)}
                />

                <label htmlFor="brand">Brand:</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  onChange={(e) => setBrand(e.target.value)}
                />

                <label htmlFor="">Description:</label>
                <textarea
                  name="description"
                  id="description"
                  cols="30"
                  rows="5"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <label htmlFor="category">Category:</label>
                <select
                  name="category"
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />

                <button
                  type="submit"
                  className="btn btn-outline-secondary py-2 px-5 mt-4"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewProduct;
