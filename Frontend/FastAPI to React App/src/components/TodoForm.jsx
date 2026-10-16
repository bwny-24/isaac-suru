import React from 'react';
import './TodoForm.css'; // Importing external styles as required by exercise

function TodoForm({ formData, handleInputChange, handleSubmit, editingId, handleCancelEdit }) {
  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="card-title">{editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
      
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="form-textarea"
        />
      </div>

      <div className="btn-group">
        <button type="submit" className="btn-primary">
          {editingId ? 'Update Todo' : 'Add Todo'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;