import Home from "./pages/Home"
import Login from "./pages/Login"
import { Routes, Route } from "react-router"
import Protectroutes from "./protectedRoute/Protectroutes"

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={
        <Protectroutes>
          <Home />
        </Protectroutes>
      } />
    </Routes>
  )
}

export default App
