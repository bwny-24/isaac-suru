import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    completed: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    void fetchAllTodos();
  }, []);

  const fetchAllTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        await axios.put(`${API_URL}/todos/${editingId}`, formData);
        setEditingId(null);
        setFormData({ title: '', description: '', priority: 'low', completed: false });
        void fetchAllTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    } else {
      try {
        await axios.post(`${API_URL}/todos`, formData);
        setFormData({ title: '', description: '', priority: 'low', completed: false });
        void fetchAllTodos();
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  };

  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority || 'low',
      completed: todo.completed,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      void fetchAllTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Task Management System</h1>

      <div className="grid-container">
        {/* Left Side: Form */}
        <div className="card">
          <h2 className="card-title">{editingId ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
          </form>
        </div>

        {/* Right Side: Table */}
        <div className="card">
          <h2 className="card-title">Tasks List</h2>
          <table className="table-container">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.length === 0 ? (
                <tr>
                  <td colSpan="4">No items found</td>
                </tr>
              ) : (
                todos.map((todo) => (
                  <tr key={todo.id}>
                    <td>{todo.title}</td>
                    <td>{todo.description || '-'}</td>
                    <td>{todo.priority || 'low'}</td>
                    <td>
                      <button onClick={() => handleEditClick(todo)} className="action-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(todo.id)} className="action-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;