import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import TodoList from "./components/List";
import Form from "./components/Form";
import Signup from "./components/Signup";

function App() {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: "",
    priority: "Low",
    dueDate: "",
  });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setLoggedInUser(user);
    callApi();
  }, []);

  const callApi = async () => {
    try {
      const [todosResponse, usersResponse] = await Promise.all([
        fetch("http://localhost:3000/todos"),
        fetch("http://localhost:3000/users"),
      ]);
      const todosData = await todosResponse.json();
      const usersData = await usersResponse.json();

      const updatedTodos = todosData.map((todo) => ({
        ...todo,
        failed: new Date(todo.dueDate) < new Date() && !todo.completed,
      }));

      setTodos(updatedTodos);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getNextTodoId = () => {
    const maxId =
      todos.length > 0
        ? Math.max(...todos.map((todo) => parseInt(todo.id, 10)))
        : 0;
    return (maxId + 1).toString();
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) =>
        u.username === loginData.username && u.password === loginData.password
    );
    if (user) {
      setLoggedInUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTodo) {
      const updatedTodo = {
        ...formData,
        id: selectedTodo.id,
        userId: selectedTodo.userId,
        completed: formData.completed || false,
        failed: new Date(formData.dueDate) < new Date() && !formData.completed,
      };
      await fetch(`http://localhost:3000/todos/${selectedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === selectedTodo.id ? updatedTodo : todo
        )
      );
      setSelectedTodo(null);
    } else {
      const newTodo = {
        ...formData,
        id: getNextTodoId(),
        userId: loggedInUser.id,
        completed: false,
        failed: new Date(formData.dueDate) < new Date(),
      };
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]);
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setFormData(todo);
  };

  const handleDelete = async (todoId) => {
    await fetch(`http://localhost:3000/todos/${todoId}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo.id !== todoId));
  };

  const handleStatusChange = async (todoId) => {
    try {
      const updatedTodo = todos.find((todo) => todo.id === todoId);
      const updated = {
        ...updatedTodo,
        completed: !updatedTodo.completed,
        failed: updatedTodo.completed ? updatedTodo.failed : false,
      };

      await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updated : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      userId: "",
      priority: "Low",
      dueDate: "",
    });
    setSelectedTodo(null);
  };

  const handleSignup = async (signupData) => {
    const newUser = {
      ...signupData,
      id: (users.length + 1).toString(),
    };
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const addedUser = await response.json();
    setUsers([...users, addedUser]);
    alert("Sign up successful! Please log in.");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !loggedInUser ? (
              <Login
                loginData={loginData}
                handleLoginChange={handleLoginChange}
                handleLogin={handleLogin}
              />
            ) : (
              <Navigate to="/list" />
            )
          }
        />
        <Route
          path="/list"
          element={
            loggedInUser ? (
              <TodoList
                todos={todos}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleStatusChange={handleStatusChange}
                loggedInUser={loggedInUser}
                resetForm={resetForm}
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add"
          element={
            loggedInUser ? (
              <Form
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                selectedTodo={selectedTodo}
                resetForm={resetForm}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/signup"
          element={<Signup handleSignup={handleSignup} />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
