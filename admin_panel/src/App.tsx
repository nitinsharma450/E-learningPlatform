import { BrowserRouter, Route, Routes } from "react-router"
import Dashboard from "./component/dashboard"


function App() {
 

  return (
<BrowserRouter>

<Routes>
<Route path="/dasbboard" element={<Dashboard />} />


</Routes>

</BrowserRouter>
  )
}

export default App
