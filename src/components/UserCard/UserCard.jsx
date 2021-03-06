import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, Form } from 'react-bootstrap'
import dateFormat from 'dateformat'
import Swal from 'sweetalert2/src/sweetalert2'

import { useIsMount } from '../../common/customHooks/useIsMount'
import { AuthContext } from '../../common/context/Auth.context'

import axiosInstance from '../../common/http/index'

import './UserCard.css'

const UserCard = (props) => {
  const { user } = useContext(AuthContext)
  const { userData, handleDelete } = props
  const [isAdmin, setIsAdmin] = useState(`${userData.isAdmin}`)

  const isMount = useIsMount()
  const storedToken = localStorage.getItem('authToken')

  const formatDate = () => {
    const dateObj = new Date(userData.createdAt)
    return dateFormat(dateObj, ' mmm dd yyyy @ h:MM:ss TT')
  }

  const handleCheckbox = (e) => {
    const isTrue = e.target.value === 'true'
    isTrue ? setIsAdmin(false) : setIsAdmin(true)
  }

  const editIsAdmin = async () => {
    if (!isMount) {
      try {
        await axiosInstance.patch(
          `/api/users/${userData._id}`,
          { isAdmin: isAdmin },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          },
        )
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      }
    }
  }

  useEffect(() => {
    editIsAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  return (
    <>
      {user?.isAdmin && (
        <Row className="user-row">
          <Col xs={12} sm={4} lg={3}>
            <p className="text-muted">{userData._id}</p>
          </Col>
          <Col xs={12} sm={2} lg={2}>
            <p className="text-center text-muted">{formatDate()}</p>
          </Col>
          <Col xs={12} sm={4} lg={2}>
            <Form className="text-center ">
              <Form.Group className="before">
                <Form.Check
                  type="checkbox"
                  defaultChecked={userData.isAdmin}
                  value={isAdmin}
                  onChange={handleCheckbox}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col xs={12} sm={3} lg={3}>
            <p className="text-muted">{userData.email}</p>
          </Col>

          <Col xs={12} lg={2}>
            <Row>
              <Col xs={6} sm={6} lg={6} className="actions-btn">
                <Link
                  to={`/my-account/admin/user/edit/${userData._id}`} //TODO  pasar a App.js
                  className="btn btn-outline-secondary edit-btn w-100"
                >
                  Details
                </Link>
              </Col>{' '}
              <Col xs={6} sm={6} lg={6} className="actions-btn">
                <Button
                  variant="outline-danger"
                  onClick={() => handleDelete(userData._id, userData.username)}
                  className="delete-btn w-100"
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  )
}

export default UserCard
