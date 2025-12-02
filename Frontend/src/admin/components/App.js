import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Modal, Badge, Row, Col, Card } from 'react-bootstrap';

import imgDogFood from './assets/dog_food.png';   
import imgCatTower from './assets/cat_tower.png'; 
import imgBoneToy from './assets/bone_toy.png';   

const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const IconSave = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const IconEye = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconUpload = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;

const Products = () => {
  
  const [products, setProducts] = useState([
    { 
      id: 101, 
      name: 'Premium Dog Food', 
      category: 'Foods', 
      price: 45.00, 
      stock: 20, 
      image: imgDogFood 
    },
    { 
      id: 102, 
      name: 'Cat Tree Tower', 
      category: 'Furniture', 
      price: 120.00, 
      stock: 5, 
      image: imgCatTower 
    },
    { 
      id: 103, 
      name: 'Squeaky Bone', 
      category: 'Toys', 
      price: 12.50, 
      stock: 0, 
      image: imgBoneToy 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState({ 
    id: null, name: '', category: 'Foods', price: '', stock: '', image: '' 
  });

  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentProduct({ id: null, name: '', category: 'Foods', price: '', stock: '', image: '' });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct({ ...currentProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!currentProduct.name) return alert("Enter name");
    
    if (isEditing) {
      setProducts(products.map(p => p.id === currentProduct.id ? { ...currentProduct, price: parseFloat(currentProduct.price) } : p));
    } else {
      setProducts([...products, { ...currentProduct, id: Date.now(), price: parseFloat(currentProduct.price) }]);
    }
    setShowModal(false);
  };

  const handleChange = (e) => setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      {

      }
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Manage Products</h3>
        <div className="d-flex gap-2">
          {

          }
          <Button className="btn-orange" onClick={() => setShowPreview(true)}>
             <IconEye /> <span className="ms-2">User View</span>
          </Button>
          <Button className="btn-orange" onClick={handleAddNew}>
            <IconPlus /> <span className="ms-2">Add Product</span>
          </Button>
        </div>
      </div>

      {

      }
      <Row className="mb-3">
        <Col md={5}>
          <InputGroup>
              <InputGroup.Text className="bg-white border-end-0"><IconSearch/></InputGroup.Text>
              <Form.Control 
                className="border-start-0 ps-0" 
                placeholder="Search products..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
          </InputGroup>
        </Col>
      </Row>

      {

      }
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead className="table-orange-header">
            <tr><th>ID</th><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="text-muted">#{p.id}</td>
                <td>
                  {

                  }
                  <div style={{width: '40px', height: '40px', background: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <span className="text-muted" style={{fontSize: '10px'}}>No IMG</span>
                    )}
                  </div>
                </td>
                <td className="fw-bold">{p.name}</td>
                <td><Badge bg="light" text="dark" className="border">{p.category}</Badge></td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td><Badge bg={p.stock > 0 ? 'success' : 'danger'}>{p.stock}</Badge></td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(p)}><IconEdit/></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)}><IconTrash/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {

      }
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit' : 'New'} Product</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            {

            }
            <div className="mb-4 text-center">
               <div style={{width: '100px', height: '100px', background: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '8px', margin: '0 auto 10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {currentProduct.image ? (
                    <img src={currentProduct.image} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <span className="text-muted small">No Image</span>
                  )}
               </div>
               
               {

               }
               <input 
                 type="file" 
                 accept="image/*" 
                 id="imageUpload" 
                 onChange={handleImageUpload} 
                 style={{display: 'none'}} 
               />
               {

               }
               <label htmlFor="imageUpload" className="btn btn-orange btn-sm" style={{cursor: 'pointer'}}>
                 <IconUpload /> <span className="ms-1">Upload Image</span>
               </label>
            </div>

            <Form.Group className="mb-3"><Form.Label>Product Name</Form.Label><Form.Control name="name" value={currentProduct.name} onChange={handleChange}/></Form.Group>
            <Row>
                <Col><Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Select name="category" value={currentProduct.category} onChange={handleChange}><option>Foods</option><option>Furniture</option><option>Toys</option></Form.Select></Form.Group></Col>
                <Col><Form.Group className="mb-3"><Form.Label>Price</Form.Label><Form.Control type="number" name="price" value={currentProduct.price} onChange={handleChange}/></Form.Group></Col>
            </Row>
            <Form.Group><Form.Label>Stock</Form.Label><Form.Control type="number" name="stock" value={currentProduct.stock} onChange={handleChange}/></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button className="btn-orange" onClick={handleSave}><IconSave/> <span className="ms-2">Save</span></Button>
        </Modal.Footer>
      </Modal>

      {

      }
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="xl" centered>
        <Modal.Header className="bg-light">
           <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
             <IconCart /> Shop Preview (User View)
           </Modal.Title>
           <Button variant="close" onClick={() => setShowPreview(false)}></Button>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#f8f9fa'}}>
           <div className="text-center mb-4">
              <h4 className="fw-bold">Welcome to PawSy PetCentral</h4>
           </div>
           
           <Row>
             {filteredProducts.length > 0 ? filteredProducts.map(p => (
               <Col md={3} className="mb-4" key={p.id}>
                 <Card className="h-100 border-0 shadow-sm">
                    {

                    }
                    <div style={{height: '180px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #eee'}}>
                       {p.image ? (
                         <img src={p.image} alt={p.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                       ) : (
                         <div className="text-muted" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <span style={{fontSize: '30px'}}>🐾</span>
                            <small>No Image</small>
                         </div>
                       )}
                    </div>
                    <Card.Body>
                       <Badge bg="warning" text="dark" className="mb-2">{p.category}</Badge>
                       <Card.Title className="fw-bold" style={{fontSize: '1rem'}}>{p.name}</Card.Title>
                       <div className="d-flex justify-content-between align-items-center mt-3">
                          <h5 className="mb-0 text-orange fw-bold" style={{color: '#fd7e14'}}>${Number(p.price).toFixed(2)}</h5>
                          
                          {

                          }
                          <Button 
                             size="sm" 
                             variant={p.stock > 0 ? "none" : "danger"} 
                             className={p.stock > 0 ? "btn-orange" : ""}
                             disabled={p.stock <= 0}
                          >
                             {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                       </div>
                    </Card.Body>
                 </Card>
               </Col>
             )) : (
               <div className="text-center py-5 text-muted">No products available.</div>
             )}
           </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light">
           <Button variant="secondary" onClick={() => setShowPreview(false)}>Close Preview</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Products;