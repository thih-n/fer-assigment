import React from "react";
import { useNavigate } from "react-router-dom";

const Form = ({
  formData,
  handleChange,
  handleSubmit,
  selectedTodo,
  resetForm,
}) => {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    handleSubmit(e);
    resetForm();
    navigate("/list");
  };

  return (
    <div className="container">
      <h2>{selectedTodo ? "Edit Todo" : "Add Todo"}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            className="form-control"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            className="form-control"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {selectedTodo ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Form;
