import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../common/context/Auth.context'
import axiosInstance from '../../../../common/http'
import { Link } from 'react-router-dom'

import dateFormat from 'dateformat'
import ReactPaginate from 'react-paginate'
import { Row, Col, Container } from 'react-bootstrap'

import './Orders.css'

const Orders = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState([])
  const [perPage] = useState(5)
  const [pageCount, setPageCount] = useState(0)

  const storedToken = localStorage.getItem('authToken')

  const formatDate = (date) => {
    const dateObj = new Date(date)
    return dateFormat(dateObj, ' mmm dd yyyy @ h:MM:ss TT')
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setOffset(Math.ceil(selectedPage * perPage))
  }

  const getData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/orders/customer/${user._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      )
      const { data } = response
      const slice = data.slice(offset, offset + perPage)

      const postData = slice.map((order) => (
        <Row key={order._id} className="order-row">
          <Col xs={12} sm={4} lg={3}>
            <p>{order._id}</p>
          </Col>
          <Col xs={12} sm={4} lg={3}>
            <p>{formatDate(order.createdAt)}</p>
          </Col>
          <Col xs={12} sm={8} lg={2}>
            <p>{order.status}</p>
          </Col>
          <Col xs={12} sm={8} lg={2}>
            <p>{order.totalOrder} €</p>
          </Col>
          <Col xs={12} sm={12} lg={2}>
            <Link
              to={`/my-account/customer/order/${order._id}`}
              className="btn btn-outline-secondary view-btn w-100"
            >
              Order details
            </Link>
          </Col>
        </Row>
      ))

      setData(postData)
      setPageCount(Math.ceil(data.length / perPage))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset])

  useEffect(() => {
    axiosInstance
      .get(`/api/orders/customer/${user._id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setOrders(response.data)
      })
      .catch((err) => console.log(err.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Row id="manage-orders">

        <Col id="orders-list-customer" >
          <Row id="head-orders-list">
            <Col xs={12} sm={4} lg={3}>
              <p>ID</p>
            </Col>
            <Col xs={12} sm={4} lg={3}>
              <p>Created at</p>
            </Col>
            <Col xs={12} sm={8} lg={2}>
              <p>Status</p>
            </Col>
            <Col xs={12} sm={8} lg={2}>
              <p>Total order</p>
            </Col>
            <Col xs={12} sm={12} lg={2}>
              <p>Action</p>
            </Col>
          </Row>

          {!orders.length ? (
            <Row className="text-center p-5">
              <p>No orders found</p>
            </Row>
          ) : (
            <Col>
              {data}
            </Col>
          )}
          <Row className="pagination">
            <ReactPaginate
              previousLabel={'prev'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeclassname={'active'}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Orders


