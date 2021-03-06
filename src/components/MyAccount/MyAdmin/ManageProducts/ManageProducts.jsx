import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Swal from 'sweetalert2/src/sweetalert2'

import axiosInstance from '../../../../common/http'
import CategoriesFilter from '../../../CategoriesFilter/CategoriesFilter'
import SearchBar from '../../../SearchBar/SearchBar'
import AddProductButton from './NewProduct/AddProductButton/AddProductButton'
import ProductsListAdmin from './ProductsListAdmin/ProductsListAdmin'

import './ManageProducts.css'

const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [results, setResults] = useState([])
  const [reset, setReset] = useState(true)
  const [currentCategory, setCurrentCategory] = useState('')
  const [currentSearch, setCurrentSearch] = useState('')

  const storedToken = localStorage.getItem('authToken')

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/api/products`)
      setProducts(response.data.products)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    }
  }

  const handleDelete = async (id, name) => {
    try {
      const input = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
      })

      if (input.isConfirmed) {
        await Swal.fire({
          icon: 'success',
          text: `Product ${name} has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        })

        await axiosInstance.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })

        const newProducts = products.filter((product) => product._id !== id)
        setProducts(newProducts)
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    }
  }

  useEffect(() => {
    if (currentCategory) {
      const filteredByCategory = products.filter((product) => {
        return product.category._id === currentCategory
      })
      setResults(filteredByCategory)
      setCurrentSearch('')
    }

    if (currentSearch) {
      const productsFound = products.filter((product) => {
        const regex = new RegExp(currentSearch, 'i')
        const nameFound = product.name.match(regex)
        const brandFound = product.brand.match(regex)
        const skuFound = product.sku.match(regex)
        return nameFound || brandFound || skuFound
      })
      setResults(productsFound)
      setCurrentCategory('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, currentSearch])

  useEffect(() => {
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Row id="manage-products">
        <Col xs={12} md={12} lg={12} className="filter-container">
          <SearchBar setCurrentSearch={setCurrentSearch} setReset={setReset} />
          <AddProductButton />
        </Col>
        <Col xs={12} md={4} lg={3} className="filter-categories">
          <CategoriesFilter
            setCurrentCategory={setCurrentCategory}
            setReset={setReset}
          />
        </Col>
        <Col xs={12} md={8} lg={9} className="list">
          <ProductsListAdmin
            results={results}
            products={products}
            handleDelete={handleDelete}
            isShop={false}
            reset={reset}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ManageProducts
