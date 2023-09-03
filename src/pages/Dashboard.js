import React, { useState, useEffect } from "react";
import NavigationBar from "../components/Navbar";
import { Table, Button, Form, Modal } from "react-bootstrap";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../api/apiSlice";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (user) => {
    setShow(true);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setSelectedUserId(user.id);
    setPhoto(user.photo);
  };

  const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleUpdate = async () => {
    try {
      const response = await updateUser({
        id: selectedUserId,
        name: name,
        email: email,
        role: role,
        photo: photo,
      });

      if (response.error) {
        console.error("Update failed:", response.error);
      } else {
        console.log("Update successful");
        handleClose();
      }
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await deleteUser(userId);

      if (response.error) {
        console.error("Delete failed:", response.error);
      } else {
        console.log(response);
        if (searchQuery && searchResult.length > 0) {
          setSearchResult((prevSearchResult) =>
            prevSearchResult.filter((user) => user.id !== userId)
          );
        }
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleSearch = () => {
    const filteredData = data?.filter((user) => {
      const userName = user.name.toLowerCase();
      const userEmail = user.email.toLowerCase();
      const query = searchQuery.toLowerCase();

      return userName.includes(query) || userEmail.includes(query);
    });
    setSearchResult(filteredData);
  };

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);
    }
  }, [searchQuery]);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) content = <p>{error?.data?.message}</p>;

  if (isSuccess) {
    const searchData = searchQuery ? searchResult : data;
    content = searchData?.map((user, index) => {
      return (
        <tr
          key={index}
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <td>{index + 1}</td>
          <td>
            <img
              src={user.photo}
              alt="Current User Photo"
              height={100}
              width={100}
              crossOrigin="anonymous"
            />
          </td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <Button onClick={() => handleShow(user)}>Update</Button>
            <Button
              className="ms-2 btn-danger"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Update Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
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
                  <Form.Group controlId="photo" className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </td>
        </tr>
      );
    });
  }

  return (
    <div>
      <NavigationBar />
      <div className="d-flex m-5 flex-column">
        <Form className="d-flex mb-3">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-success" onClick={handleSearch}>
            Search
          </Button>
        </Form>
        <Table bordered hover>
          <thead>
            <tr style={{ textAlign: "center", verticalAlign: "middle" }}>
              <th>No.</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
