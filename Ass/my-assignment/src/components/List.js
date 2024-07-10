import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const List = ({
  todos,
  handleEdit,
  handleDelete,
  handleStatusChange,
  loggedInUser,
  resetForm,
}) => {
  const [sortedTodos, setSortedTodos] = useState([]);
  const [searchPriority, setSearchPriority] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSortedTodos([...todos]);
  }, [todos]);

  const sortByTitle = () => {
    const sorted = [...sortedTodos].sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      return 0;
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

  const filteredTodos = sortedTodos.filter(
    (todo) =>
      (searchPriority === "" || todo.priority === searchPriority) &&
      (searchStatus === "" ||
        (searchStatus === "Completed" && todo.completed) ||
        (searchStatus === "Uncompleted" && !todo.completed))
  );

  return (
    <div className="container">
      <h2>{loggedInUser.name}'s Todo List</h2>
      <button
        className="btn btn-primary"
        onClick={() => {
          resetForm();
          navigate("/add");
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
      <table className="table mt-3">
        <thead>
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos
            .filter((todo) => todo.userId === loggedInUser.id)
            .map((todo, index) => (
              <tr key={todo.id}>
                <td>{index + 1}</td>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.priority}</td>
                <td>{new Date(todo.dueDate).toLocaleString()}</td>
                <td>{todo.completed ? "Finished" : "Unfinished"}</td>
                <td>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => {
                      handleEdit(todo);
                      navigate("/add");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mr-2"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusChange(todo.id)}
                  >
                    {todo.completed ? "Undone" : "Done"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
