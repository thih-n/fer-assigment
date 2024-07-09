import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import TodoList from "./components/List";
import Modal from "./components/Modal";

function App() {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
  const [sortedTodos, setSortedTodos] = useState([]);
  const [searchPriority, setSearchPriority] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    callApi();
  }, []);

  useEffect(() => {
    if (!showModal) {
      resetForm();
    }
  }, [showModal]);

  useEffect(() => {
    setSortedTodos([...todos]);
  }, [todos]);

  const callApi = async () => {
    try {
      const [todosResponse, usersResponse] = await Promise.all([
        fetch("http://localhost:3000/todos"),
        fetch("http://localhost:3000/users"),
      ]);
      const todosData = await todosResponse.json();
      const usersData = await usersResponse.json();

      setTodos(todosData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getNextTodoId = () => {
    const maxId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) : 0;
    return maxId + 1;
  };

  const sortByTitle = () => {
    const sorted = [...sortedTodos].sort((a, b) => {
      if (a.title[0].toLowerCase() < b.title[0].toLowerCase()) return -1;
      if (a.title[0].toLowerCase() > b.title[0].toLowerCase()) return 1;
      return a.title.length - b.title.length;
    });
    setSortedTodos(sorted);
  };

  const sortByDate = () => {
    const sorted = [...sortedTodos].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
    setSortedTodos(sorted);
  };

  const handleSearchPriorityChange = (e) => {
    setSearchPriority(e.target.value);
  };

  const handleSearchStatusChange = (e) => {
    setSearchStatus(e.target.value);
  };

  const handleSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleSearchTitle = () => {
    const filtered = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    setSortedTodos(filtered);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) =>
        u.username === loginData.username && u.password === loginData.password
    );
    if (user) {
      setLoggedInUser(user);
    } else {
      alert("Invalid username or password");
    }
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
      await fetch(`http://localhost:3000/todos/${selectedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === selectedTodo.id ? formData : todo))
      );
      setSelectedTodo(null);
    } else {
      const newTodo = {
        ...formData,
        id: getNextTodoId(),
        userId: loggedInUser.id,
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
    setShowModal(false); // Close the modal after submitting the form
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setFormData(todo);
    setShowModal(true); // Show the modal when editing
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
      const updated = { ...updatedTodo, completed: !updatedTodo.completed };

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

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredTodos = sortedTodos.filter(
    (todo) =>
      (searchPriority === "" || todo.priority === searchPriority) &&
      (searchStatus === "" ||
        (searchStatus === "Completed" && todo.completed) ||
        (searchStatus === "Uncompleted" && !todo.completed))
  );

  if (!loggedInUser) {
    return (
      <Login
        loginData={loginData}
        handleLoginChange={handleLoginChange}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div className="container">
      <h2>{loggedInUser.name}'s Todo List</h2>
      <button
        className="btn btn-primary"
        onClick={() => {
          setSelectedTodo(null);
          setShowModal(true); // Show the modal when adding
        }}
      >
        Add
      </button>
      <button className="btn btn-primary ml-2" onClick={sortByTitle}>
        Sort by Title
      </button>
      <button className="btn btn-primary ml-2" onClick={sortByDate}>
        Sort by Date
      </button>
      <select
        className="form-control mt-2"
        value={searchPriority}
        onChange={handleSearchPriorityChange}
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        className="form-control mt-2"
        value={searchStatus}
        onChange={handleSearchStatusChange}
      >
        <option value="">All Statuses</option>
        <option value="Completed">Finished</option>
        <option value="Uncompleted">Unfinished</option>
      </select>
      <input
        type="text"
        className="form-control mt-2"
        value={searchTitle}
        onChange={handleSearchTitleChange}
        placeholder="Search by Title"
      />
      <button className="btn btn-primary mt-2" onClick={handleSearchTitle}>
        Search Title
      </button>

      <Modal
        showModal={showModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        selectedTodo={selectedTodo}
        resetForm={resetForm}
        closeModal={closeModal}
      />

      <TodoList
        todos={filteredTodos}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleStatusChange={handleStatusChange}
        loggedInUser={loggedInUser}
      />
    </div>
  );
}

export default App;
