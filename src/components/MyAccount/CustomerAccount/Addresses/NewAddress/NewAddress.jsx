import { useContext, useState } from 'react'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2/src/sweetalert2'

import { AuthContext } from '../../../../../common/context/Auth.context'

import axiosInstance from '../../../../../common/http'

import './NewAddress.css'

const NewAddress = () => {
  const { user } = useContext(AuthContext)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  const storedToken = localStorage.getItem('authToken')

  const navigate = useNavigate()
  const { type } = useParams()

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
    const emailRegex = new RegExp(/^\S+@\S+\.\S+$/)

    const {
      firstName,
      lastName,
      phone,
      email,
      street,
      city,
      zip,
      province,
      country,
    } = form
    const newErrors = {}

    // firstName errors
    if (!firstName || firstName === '')
      newErrors.firstName = 'This field cannot be blank.'
    else if (firstName.length < 2)
      newErrors.name = 'First name cannot be less than 2 characters long.'
    else if (firstName.length > 40)
      newErrors.firstName = 'First name cannot be more than 40 characters long.'

    // lastName errors
    if (!lastName || lastName === '')
      newErrors.lastName = 'This field cannot be blank.'
    else if (lastName.length < 2)
      newErrors.lastName = 'Last name cannot be less than 2 characters long.'
    else if (lastName.length > 40)
      newErrors.lastName = 'Last name cannot be more than 40 characters long.'

    // phone errors
    if (!phone || phone === '') newErrors.phone = 'This field cannot be blank.'
    else if (phone.length < 9)
      newErrors.phone = 'This field cannot be less than 9 characters long.'

    // email errors
    if (!email || email === '') newErrors.email = 'This field cannot be blank.'
    else if (!emailRegex.test(email))
      newErrors.email = 'Please provide a valid email address.'

    // street errors
    if (!street || street === '')
      newErrors.street = 'This field cannot be blank.'

    // city errors
    if (!city || city === '') newErrors.city = 'This field cannot be blank.'

    // zip errors
    if (!zip || zip === '') newErrors.zip = 'This field cannot be blank.'
    else if (zip.length < 4)
      newErrors.zip = 'Zip field cannot be less than 2 characters long.'

    // province errors
    if (!province || province === '')
      newErrors.province = 'This field cannot be blank.'
    else if (province.length < 2)
      newErrors.province = 'Province cannot be less than 2 characters long.'
    else if (province.length > 40)
      newErrors.province = 'Province cannot be more than 40 characters long.'

    // country errors
    if (!country || country === '')
      newErrors.country = 'This field cannot be blank.'
    else if (country.length < 2)
      newErrors.country = 'Country cannot be less than 2 characters long.'
    else if (country.length > 40)
      newErrors.country = 'Country cannot be more than 40 characters long.'

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = findFormErrors()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      const body = { ...form }

      axiosInstance
        .post(`/api/users/${user._id}/address/${type}`, body, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            text: 'Address added successfully',
            showConfirmButton: false,
          })
          navigate('/my-account/customer/address-list')
        })
        .catch((err) =>
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong creating your order',
            showConfirmButton: false,
          }),
        )
    }
  }

  return (
    <section
      id="create-address"
      className="d-flex flex-column justify-content-center align-items-center container"
    >
      <div className="col-sm-12 col-md-6 ">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('firstName', e.target.value)}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('lastName', e.target.value)}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('phone', e.target.value)}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Company (Optional)</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('company', e.target.value)}
                isInvalid={!!errors.company}
              />
              <Form.Control.Feedback type="invalid">
                {errors.company}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Email address *</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Street address *</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('street', e.target.value)}
                isInvalid={!!errors.street}
              />
              <Form.Control.Feedback type="invalid">
                {errors.street}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Postcode / ZIP *</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setField('zip', e.target.value)}
                isInvalid={!!errors.zip}
              />
              <Form.Control.Feedback type="invalid">
                {errors.zip}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Town / City *</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('city', e.target.value)}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Province *</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('province', e.target.value)}
                isInvalid={!!errors.province}
              />
              <Form.Control.Feedback type="invalid">
                {errors.province}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Country / Region</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setField('country', e.target.value)}
                isInvalid={!!errors.country}
              />
              <Form.Control.Feedback type="invalid">
                {errors.country}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Button variant="outline-success" type="submit">
            Save address
          </Button>
        </Form>
      </div>
    </section>
  )
}

export default NewAddress
