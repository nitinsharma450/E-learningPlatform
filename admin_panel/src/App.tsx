import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Layout from "./component/Layout";
import { ToastContainer } from "react-toastify";

import Login from "./auth/Login";
import { lazy, Suspense } from "react";
import Spinner from "./component/Spinner";
import TeacherAddListing from "./pages/TeacherAddListing";

// const TeacherAddListing = lazy(() => import("./pages/TeacherAddListing"));

function App() {
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
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route
            path="/teacher"
            element={
              <Suspense fallback={<Spinner />}>
                <TeacherAddListing />
              </Suspense>
            }
          /> */}

          <Route path="/teacher" element={<TeacherAddListing />} />
        </Route>
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
