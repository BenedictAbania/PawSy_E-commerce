import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Modal,
  Badge,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

const API_URL = "http://localhost:8083/api/products";
const IMAGE_BASE_URL = "http://localhost:8083";

// Icons
const IconPlus = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const IconSearch = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const IconEdit = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const IconTrash = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const IconSave = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);
const IconEye = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const IconUpload = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    category: "Foods",
    price: "",
    stock: "",
    image: "",
    imageFile: null,
    brand: "",
    petType: "Dog",
    tags: "", // Added Tags
    is_featured: false,
    is_best_seller: false,
  });

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("/storage")) return `${IMAGE_BASE_URL}${path}`;
    return path;
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: null,
      name: "",
      category: "Foods",
      price: "",
      stock: "",
      image: "",
      imageFile: null,
      brand: "",
      petType: "Dog",
      tags: "",
      is_featured: false,
      is_best_seller: false,
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    // Convert array tags back to string for editing
    const tagsString = Array.isArray(product.tags)
      ? product.tags.join(", ")
      : "";

    setCurrentProduct({
      ...product,
      imageFile: null,
      tags: tagsString, // Show as "Tag1, Tag2"
      is_featured: Boolean(product.is_featured),
      is_best_seller: Boolean(product.is_best_seller),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentProduct({
            ...currentProduct,
            image: reader.result,
            imageFile: file,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setCurrentProduct({
        ...currentProduct,
        image: e.target.value,
        imageFile: null,
      });
    }
  };

  const handleSave = async () => {
    if (!currentProduct.name) return alert("Enter name");

    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("category", currentProduct.category);
    formData.append("price", currentProduct.price);
    formData.append("stock", currentProduct.stock);
    formData.append("brand", currentProduct.brand || "");
    formData.append("petType", currentProduct.petType || "");

    // Convert Tags String to Array JSON
    const tagsArray = currentProduct.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    formData.append("tags", JSON.stringify(tagsArray));

    formData.append("is_featured", currentProduct.is_featured ? "1" : "0");
    formData.append(
      "is_best_seller",
      currentProduct.is_best_seller ? "1" : "0"
    );

    if (currentProduct.imageFile) {
      formData.append("image", currentProduct.imageFile);
    } else if (currentProduct.image) {
      formData.append("image", currentProduct.image);
    }

    try {
      let response;
      if (isEditing) {
        formData.append("_method", "PUT");
        response = await fetch(`${API_URL}/${currentProduct.id}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(API_URL, { method: "POST", body: formData });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save");
      }

      const savedProduct = await response.json();

      if (isEditing) {
        setProducts(
          products.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        );
      } else {
        setProducts([...products, savedProduct]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save. Check console.");
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setCurrentProduct({ ...currentProduct, [e.target.name]: value });
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Manage Products</h3>
        <div className="d-flex gap-2">
          <Button className="btn-orange" onClick={() => setShowPreview(true)}>
            <IconEye /> <span className="ms-2">User View</span>
          </Button>
          <Button className="btn-orange" onClick={handleAddNew}>
            <IconPlus /> <span className="ms-2">Add Product</span>
          </Button>
        </div>
      </div>

      <Row className="mb-3">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <IconSearch />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0 ps-0"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-orange-header">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Info</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        background: "#f8f9fa",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </td>
                  <td className="fw-bold">{p.name}</td>
                  <td>
                    <Badge bg="light" text="dark" className="border me-1">
                      {p.category}
                    </Badge>
                    <small className="text-muted d-block">
                      {p.brand} ({p.petType})
                    </small>
                  </td>
                  <td>
                    {p.is_featured && (
                      <Badge bg="warning" className="me-1">
                        Featured
                      </Badge>
                    )}
                    {p.is_best_seller && (
                      <Badge bg="success">Best Seller</Badge>
                    )}
                  </td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(p)}
                    >
                      <IconEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      <IconTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit" : "New"} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-4 text-center">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  background: "#f8f9fa",
                  border: "2px dashed #dee2e6",
                  borderRadius: "8px",
                  margin: "0 auto 10px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {currentProduct.image ? (
                  <img
                    src={getImageUrl(currentProduct.image)}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span className="text-muted small">No Image</span>
                )}
              </div>
              <InputGroup className="mb-2">
                <Form.Control
                  placeholder="Image URL..."
                  value={currentProduct.imageFile ? "" : currentProduct.image}
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="imageUpload"
                  className="btn btn-orange"
                  style={{ cursor: "pointer" }}
                >
                  <IconUpload /> Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </InputGroup>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                name="name"
                value={currentProduct.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={currentProduct.category}
                    onChange={handleChange}
                  >
                    <option>Foods</option>
                    <option>Furniture</option>
                    <option>Toys</option>
                    <option>Accessories</option>
                    <option>Bags</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Pet Type</Form.Label>
                  <Form.Select
                    name="petType"
                    value={currentProduct.petType}
                    onChange={handleChange}
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Parrot</option>
                    <option>Hamster</option>
                    <option>Turtle</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={currentProduct.stock}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                name="brand"
                value={currentProduct.brand}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Added Tags Input */}
            <Form.Group className="mb-3">
              <Form.Label>Tags (separated by comma)</Form.Label>
              <Form.Control
                name="tags"
                value={currentProduct.tags}
                onChange={handleChange}
                placeholder="e.g. Natural, Sale, New"
              />
            </Form.Group>

            <div className="d-flex gap-3 mt-3 p-3 bg-light rounded">
              <Form.Check
                type="switch"
                id="is_featured"
                label="Featured Product"
                name="is_featured"
                checked={currentProduct.is_featured}
                onChange={handleChange}
              />
              <Form.Check
                type="switch"
                id="is_best_seller"
                label="Best Seller"
                name="is_best_seller"
                checked={currentProduct.is_best_seller}
                onChange={handleChange}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="btn-orange" onClick={handleSave}>
            <IconSave /> <span className="ms-2">Save</span>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="xl"
        centered
      >
        <Modal.Body className="text-center p-5">
          <h4>Shop Preview</h4>
          <p className="text-muted">
            Use the "Shop" page to see these changes live.
          </p>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
