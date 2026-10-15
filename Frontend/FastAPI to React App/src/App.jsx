import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Replace with your FastAPI backend URL if different

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all items on component load
  useEffect(() => {
    fetchAllTodos();
  }, []);

  // 1. READ ALL (GET)
  const fetchAllTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 2. CREATE (POST) & UPDATE (PUT) Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Perform Update
      try {
        await axios.put(`${API_URL}/todos/${editingId}`, formData);
        setEditingId(null);
        setFormData({ title: '', description: '', completed: false });
        fetchAllTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
        alert('Error updating todo');
      }
    } else {
      // Perform Create
      try {
        await axios.post(`${API_URL}/todos`, formData);
        setFormData({ title: '', description: '', completed: false });
        fetchAllTodos();
      } catch (error) {
        console.error('Error creating todo:', error);
        alert('Error creating todo');
      }
    }
  };

  // Set form to edit mode
  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed,
    });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', completed: false });
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      fetchAllTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Error deleting todo');
    }
  };

  // Quick Toggle Status (PUT)
  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`${API_URL}/todos/${todo.id}`, {
        title: todo.title,
        description: todo.description || '',
        completed: !todo.completed,
      });
      fetchAllTodos();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Todo App (FastAPI + React)</h2>

      {/* Form for Creating and Updating */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>{editingId ? 'Edit Todo' : 'Add New Todo'}</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="title"
            placeholder="Title (min 3 chars)"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleInputChange}
            />
            {' '} Completed
          </label>
        </div>

        <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
          {editingId ? 'Update Todo' : 'Add Todo'}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px' }}>
            Cancel
          </button>
        )}
      </form>

      {/* List of Todos */}
      <h3>All Todos</h3>
      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #ddd',
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  style={{ marginRight: '10px' }}
                />
                <strong>{todo.title}</strong>
                {todo.description && <p style={{ margin: '4px 0 0 25px', fontSize: '0.9em', color: '#666' }}>{todo.description}</p>}
              </div>

              <div>
                <button onClick={() => handleEditClick(todo)} style={{ marginRight: '5px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;