import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
//  const [count, setCount] = useState(0)

const [books, setBooks]  = useState([])
const [formData, setFormData] = useState({
  title:'',
  author:'',
  published_year:''
})

constant [editingId, setEditing] = useState (null)
constant API_URL = 'http://localhost:8000'

useEffect(() => {
  fetchAllBooks()
}, )



}

export default App
