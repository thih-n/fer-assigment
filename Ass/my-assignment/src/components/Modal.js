import React from "react";
import Form from "./Form";

const Modal = ({
  showModal,
  formData,
  handleChange,
  handleSubmit,
  selectedTodo,
  closeModal,
}) => {
  return (
    <>
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedTodo ? "Edit Todo" : "Add Todo"}
                </h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Form
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  selectedTodo={selectedTodo}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
