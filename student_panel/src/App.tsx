import { Route } from "react-router"
import { BrowserRouter, Routes } from "react-router"


import { lazy, Suspense } from "react"
import Spinner from "./components/Spinner"
import { ToastContainer } from "react-toastify";

function App() {

  const LazyDashboard = lazy(() => import('./pages/Dashboard'));
  const LazyLogin = lazy(() => import('./pages/Login'));

  return (
    <>
    
<ToastContainer
        position="top-right" // top-left, bottom-right, etc.
        autoClose={3000} // auto close in ms
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

   <BrowserRouter>
   
   <Routes>


    <Route path="/"  element={<Suspense fallback={<Spinner />}> <LazyDashboard /></Suspense>}/>
    <Route path="/login"  element={<Suspense fallback={<Spinner />}> <LazyLogin /></Suspense>}/>
   </Routes>
   
   </BrowserRouter>
   </>
  )
}

export default App
