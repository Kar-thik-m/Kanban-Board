import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './assets/Home.tsx'
import Columns from './columns.tsx'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/border/:id" element={<Columns />} />
      </Routes>
    </Router>
  )
}

export default App
