import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
//  const [count, setCount] = useState(0)

const [todos, setTodos]  = useState([])
const [formData, setFormData] = useState({
  title:'',
  description:'',
  completed: False
})

const [editingId, setEditing] = useState (null)
const API_URL = 'http://localhost:8000'

useEffect(() => {
  fetchAllTodos()
}, )

// Get Request

const fetchAllTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`)
    setBooks(response.data)
  } catch (error){
    console.error('Error fetching todos:', error)
  }
}

const createTodo = async (e) => {
  e.preventDefault()
  try{
    await axios.post(`${API_URL}/todos`, {
      title: formData.title,
      description: formData.description,
      completed: 
      
    })
  }
}


}

export default App
