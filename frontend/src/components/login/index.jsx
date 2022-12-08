import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // When user type something -> data will change
  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:8000/api/auth/login";
      const response = await axios.post(url, data);
      localStorage.setItem("token", response.data);
      window.location = "/homepage";
      console.log(response.data.message);
    } catch (error) {
      if (error.response.data) {
        setError(error.response.data.message);
        console.log(error.response.data);
        console.log(error.response.data.message);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <Container className={styles.wrapper}>
      <Form className={styles.login_form} onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Đăng nhập</h3>
        <Form.Group className="mb-3" controlId="formGridUsername">
          <Form.Label>Tên đăng nhập</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên đăng nhập"
            name="username"
            value={data.username}
            required
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridPassword1">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu"
            name="password"
            value={data.password}
            required
            onChange={handleChange}
          />
        </Form.Group>

        {error && (
          <Row>
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        <div className="my-4">
          <Button variant="success" type="submit" className="mx-auto d-block">
            Đăng nhập
          </Button>
        </div>
        <div className="text-center">
          <span>Không có tài khoản?</span>
          <Link to="/register">
            <Button variant="info" className="ms-2">
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
