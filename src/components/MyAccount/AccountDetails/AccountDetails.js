import { useContext, useState } from "react";
import { AuthContext } from "../../../common/context/auth.context";
import { Form, Row, Col, Button } from "react-bootstrap";
import axiosInstance from "../../../common/http";

function AccountDetails() {
  const { user, updateUser } = useContext(AuthContext)
  const [name, setName] = useState((user.name || ""));
  const [surname, setSurname] = useState((user.surname || ""));
  const [username, setUsername] = useState((user.username || ""));
  const [phone, setPhone] = useState((user.phone || ""));
  const [email, setEmail] = useState((user.email || ""));
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const storedToken = localStorage.getItem("authToken");


  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === rePassword) {
      const body = { name, surname, username, email, phone, password };
      axiosInstance
        .patch(`/api/users/${user._id}`, body, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => updateUser(response.data.user))
        .catch((error) => {
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        });
    } else {
      // TODO: lógica contraseñas no coinciden, msg , etc...
    }
  };

  // useEffect()

  //console.log('user', user)
  return (
    <div className="section">
      <div className="dashboard-wrapper text-muted d-flex justify-content-center">
        <div className="d-flex flex-column justify-content-center align-items-center col-sm-12 col-md-8 col-lg-10">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value= {name}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setSurname(e.target.value)}
                  value={surname}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Repeat password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit">
              Submit changes
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;