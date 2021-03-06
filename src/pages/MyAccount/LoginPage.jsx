import { useState, useContext, useRef } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../common/context/Auth.context'
import axiosInstance from '../../common/http/index'

import Logo from '../../images/logo2.png'
import './LoginPage.css'

const LoginPage = () => {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const passwordInput = useRef(null)

  const { logInUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    })
    // Check and see if errors , and remove them from the error object:
    if (errors[field])
      setErrors({
        ...errors,
        [field]: null,
      })
  }

  const hideShowPassword = () => {
    const inputElement = passwordInput.current
    inputElement.type = inputElement.type === 'password' ? 'text' : 'password'
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const newErrors = findFormErrors()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const requestBody = { ...form }
    try {
      const response = await axiosInstance.post(`/api/auth/login`, requestBody)
      const { authToken, isAdmin } = response.data

      logInUser(authToken)

      isAdmin
        ? navigate('/my-account/admin/dashboard')
        : navigate('/my-account/customer/dashboard')
    } catch (err) {
      setErrors({ unauthorized: err.response.data })
    }
  }
  const findFormErrors = () => {
    const { email, password } = form
    const newErrors = {}

    const emailRegex = new RegExp(/^\S+@\S+\.\S+$/)
    const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)

    // email errors
    if (!email || email === '') newErrors.email = 'This field cannot be blank.'
    else if (!emailRegex.test(email))
      newErrors.email = 'Please provide a valid email address.'

    // password errors
    if (!password || password === '')
      newErrors.password = 'This field cannot be blank.'
    else if (!passwordRegex.test(password))
      newErrors.password =
        'Password must be 6 characters long and have one number, one lowercase and one uppercase letter.'

    return newErrors
  }

  return (
    <section
      className="container d-flex flex-column justify-content-center align-items-center"
      id="login"
    >
      <div className="login-wrapper">
        <div className="text-center logo">
          <Link to={'/my-account'} className="logolink">
            <img
              src={Logo}
              alt="logo"
              className="d-inline-block"
              width="100"
              height="100"
            />
          </Link>
        </div>

        <div className="login-container">
          <p className="text-center mb-4">
            I'm an existing customer and would like to login.
          </p>

          <Form className="text-center" onSubmit={handleLoginSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setField('email', e.target.value)}
                  isInvalid={errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  ref={passwordInput}
                  type="password"
                  onChange={(e) => setField('password', e.target.value)}
                  isInvalid={errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <div className="d-flex justify-content-between">
              <div className="show-password">
                <Form.Group
                  className="mb-3"
                  controlId="formBasicCheckbox"
                  onClick={hideShowPassword}
                >
                  <Form.Check type="checkbox" label="Show password" />
                </Form.Group>
              </div>

              <div className="lost-password">
                <a href="#!">Lost Password?</a>
              </div>
            </div>

            <div className="credentials-error">{errors.unauthorized}</div>

            <Button
              variant="outline-secondary"
              className="py-2 px-5 mt-2"
              type="submit"
            >
              Login
            </Button>
          </Form>

          <div className="text-center mb-5">
            <p>I'm a new customer and would like to register.</p>
            <Link
              to={'/signup'}
              className="btn btn-outline-secondary py-2 px-4 mt-3"
              id="create-account"
            >
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
