import React, { Component } from "react";
import axios from "axios";

export default class CreateUser extends Component {
  state = {
    username: "",
    users: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.getUsers();
  }

  getUsers = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get("http://localhost:5001/api/users");
      this.setState({
        users: res.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({ loading: false, error: "Error fetching users" });
    }
  };

  onChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
      error: null,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.state.username.trim() === "") {
      this.setState({ error: "Username cannot be empty" });
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/users/", {
        username: this.state.username,
      });
      this.setState({ username: "", error: null });
      this.updateUserListLocally();
    } catch (error) {
      this.setState({ error: "Error creating user" });
    }
  };

  updateUserListLocally = () => {
    const newUser = { _id: Date.now(), username: this.state.username };
    this.setState((prevState) => ({
      users: [...prevState.users, newUser],
    }));
  };

  deleteUser = async (userId) => {
    const response = window.confirm("Are you sure you want to delete it?");
    if (response) {
      try {
        await axios.delete(`http://localhost:5001/api/users/${userId}`);
        this.setState({ error: null });
        this.deleteUserLocally(userId);
      } catch (error) {
        this.setState({ error: "Error deleting user" });
      }
    }
  };

  deleteUserLocally = (userId) => {
    this.setState((prevState) => ({
      users: prevState.users.filter((user) => user._id !== userId),
    }));
  };

  render() {
    const { username, users, loading, error } = this.state;

    return (
      <div className="row">
        <div className="col-md-4">
          <div className="card card-body">
            <h3>Crear usuario</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  value={username}
                  type="text"
                  onChange={this.onChangeUsername}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-2">
                Save
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <h3>Lista de Usuarios</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-group">
              {users.map((user) => (
                <li
                  className="list-group-item list-group-item-action"
                  key={user._id}
                  onDoubleClick={() => this.deleteUser(user._id)}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}
