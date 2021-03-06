import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import axiosInstance from '../../../../../common/http'
import Swal from 'sweetalert2/src/sweetalert2'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'
import './NewProduct.css'

const NewProduct = () => {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])

  const storedToken = localStorage.getItem('authToken')

  const getCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      setCategories(response.data)
      form.category = response.data[0]._id
      setForm({ ...form })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    }
  }

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    })
    // Check and see if errors , and remove them from the error object:
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      })
  }

  const findFormErrors = () => {
    const { sku, quantity, name, price, tax, brand, category } = form
    const newErrors = {}

    // sku errors
    if (!sku || sku === '') newErrors.sku = 'This field cannot be blank.'

    // name errors
    if (!name || name === '') newErrors.name = 'This field cannot be blank.'
    else if (name.length < 3)
      newErrors.name = 'Title cannot be less than 3 characters long.'
    else if (name.length > 70)
      newErrors.name = 'Title cannot be more than 70 characters long.'

    // quantity errors
    if (!quantity || quantity === '')
      newErrors.quantity = 'This field cannot be blank.'
    else if (quantity < 0)
      newErrors.quantity = 'Quantity cannot be less than 0.'

    // price errors
    if (!price || price === '') newErrors.price = 'This field cannot be blank.'
    else if (price < 0) newErrors.price = 'Price cannot be less than 0.'

    // tax errors
    if (!tax || tax === '') newErrors.tax = 'This field cannot be blank.'
    else if (tax < 0) newErrors.tax = 'Tax cannot be less than 0.'

    // brand errors
    if (!brand || brand === '') newErrors.brand = 'This field cannot be blank.'
    else if (brand.length < 2)
      newErrors.brand = 'Title cannot be less than 2 characters long.'
    else if (brand.length > 20)
      newErrors.brand = 'Brand cannot be more than 20 characters long.'

    // category
    if (!category || category === '')
      newErrors.category = 'This field cannot be blank!'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = findFormErrors()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const body = new FormData()
    body.append('sku', form.sku)
    body.append('quantity', form.quantity)
    body.append('name', form.name)
    body.append('price', form.price)
    body.append('tax', form.tax)
    body.append('brand', form.brand)
    body.append('description', form.description)
    body.append('category', form.category)
    body.append('imageUrl', form.image)

    try {
      await axiosInstance.post(`/api/products/create`, body, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      e.target.reset()
      Swal.fire({
        icon: 'success',
        text: 'Product created successfully',
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    }
  }

  useEffect(() => {
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      className="container d-flex flex-column justify-content-center align-items-center"
      id="create-product"
    >
      <Col sm={12} md={9} lg={7} xl={6} className="create-product-wrapper">
        <h3 className="text-center text-muted text-uppercase">New product</h3>

        <div className="create-product-container">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setField('sku', e.target.value)}
                  isInvalid={!!errors.sku}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.sku}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setField('quantity', e.target.value)}
                  isInvalid={!!errors.quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Tax</Form.Label>
                <Form.Control
                  step="any"
                  type="number"
                  onChange={(e) => setField('tax', e.target.value)}
                  isInvalid={!!errors.tax}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tax}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  step="any"
                  type="number"
                  onChange={(e) => setField('price', e.target.value)}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setField('name', e.target.value)}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setField('brand', e.target.value)}
                  isInvalid={!!errors.brand}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.brand}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3" id="text-editor">
              <Form.Group as={Col}>
                <Form.Label>Description</Form.Label>

                <ReactQuill
                  theme={'snow'}
                  defaultValue={''}
                  onChange={(innerHTML) => setField('description', innerHTML)}
                  isInvalid={!!errors.description}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ color: [] }], // dropdown with defaults from theme
                      [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                        { align: [] },
                      ],

                      ['link'],
                      ['clean'],
                    ],
                  }}
                  formats={[
                    'header',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'list',
                    'bullet',
                    'indent',
                    'link',
                    'color',
                    'background',
                    'align',
                  ]}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setField('category', e.target.value)}
                  isInvalid={!!errors.category}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setField('image', e.target.files[0])}
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="outline-success" type="submit">
              Submit changes
            </Button>
          </Form>
        </div>
      </Col>
    </section>
  )
}

export default NewProduct
