import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
//  const [count, setCount] = useState(0)

const [todos, setTodos]  = useState([])
// Initial form state aligned with TodoRequest schema
const [formData, setFormData] = useState({
  title: '',
  description: '',
  completed: false
});

// GET Request: Fetch all todos
const fetchAllTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    setTodos(response.data);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

// POST Request: Create a new todo
const createTodo = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${API_URL}/todos`, {
      title: formData.title,
      description: formData.description,
      completed: formData.completed
    });
    setFormData({ title: '', description: '', completed: false });
    fetchAllTodos();
  } catch (error) {
    console.error('Error creating todo:', error);
    alert('Error adding todo');
  }
};

// PUT Request: Update an existing todo
const updateTodo = async (todoId, updatedData) => {
  try {
    await axios.put(`${API_URL}/todos/${todoId}`, {
      title: updatedData.title,
      description: updatedData.description,
      completed: updatedData.completed
    });
    fetchAllTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
    alert('Error updating todo');
  }
};

// DELETE Request: Delete a todo by ID
const deleteTodo = async (todoId) => {
  try {
    await axios.delete(`${API_URL}/todos/${todoId}`);
    fetchAllTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Error deleting todo');
  }
};

}

export default App
