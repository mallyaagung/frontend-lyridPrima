import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useLoginMutation } from "../api/apiSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        email: email,
        password: password,
      });

      if (response.data) {
        console.log("Login Success");
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else if (response.error) {
        console.error("Login failed:", response.error);
        // setLoginError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login error", err);
      // setLoginError(
      //   "An error occurred while logging in. Please try again later."
      // );
    }
  };

  return (
    <div className="login-container">
      <div className="center-container">
        <Container className="mt-5">
          <Card style={{ width: "25rem" }}>
            <Card.Body>
              <h2 className="text-center">Login</h2>
              <Form onSubmit={handleSubmit}>
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
                  Don't have an account?{" "}
                  <Link to="/registration">Register here</Link>
                </p>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ marginTop: "1rem" }}
                  >
                    Log In
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

export default Login;
