import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import { Tasks } from "./pages/Tasks"
import ProtectedRoute from "./components/ProtectedRoute"
import './components/workboard.css';

function App() {

  return <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute> }/>
      <Route path="/tasks/:id" element={<ProtectedRoute><Tasks /></ProtectedRoute>}/>
    </Routes>
  </Router>
}

export default App
