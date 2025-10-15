import { BrowserRouter, Route, Routes } from "react-router"
import Dashboard from "./pages/Dashboard"
import Layout from "./component/Layout"


function App() {
 

  return (
<BrowserRouter>

<Routes>
<Route element={<Layout />}>
<Route path="/dashboard" element={<Dashboard />} />

</Route>





</Routes>

</BrowserRouter>
  )
}

export default App
