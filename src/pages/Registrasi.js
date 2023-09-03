import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useRegistrasiMutation } from "../api/apiSlice";

const Registrasi = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const [registrasi] = useRegistrasiMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registrasi({
        name: name,
        email: email,
        password: password,
        role: role,
      });
      console.log("Registration successful:", response); // Log success response

      // Clear form fields
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error); // Log registration error
    }
  };

  return (
    <div className="login-container">
      <div className="center-container">
        <Container className="mt-5">
          <Card style={{ width: "25rem" }}>
            <Card.Body>
              <h2 className="text-center">Registrasi</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="role">
                  <Form.Label>Roles</Form.Label>
                  <Form.Select
                    aria-label="Roles"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Choose your role</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <p className="text-center mt-3">
                  Already have account? <Link to="/">Login here</Link>
                </p>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ marginTop: "1rem" }}
                  >
                    Sign Up
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default Registrasi;
