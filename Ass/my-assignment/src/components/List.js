import React from "react";

const List = ({
  todos,
  handleEdit,
  handleDelete,
  handleStatusChange,
  loggedInUser,
}) => {
  return (
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
        {todos
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
                  onClick={() => handleEdit(todo)}
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
  );
};

export default List;
