import { BrowserRouter, Routes, Route } from "react-router"
import Layout from "./component/Layout"
import Dashboard from "./dashboard/Dashboard"





function App() {
 

  return (
    <>
  <BrowserRouter>
  <Routes>

    <Route element={<Layout />}>
    
    <Route path="/dashboard" element={<Dashboard />} />
    
    
    </Route>
  </Routes>
  
  
  </BrowserRouter>
    
    </>
     
  )
}

export default App
