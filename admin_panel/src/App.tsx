import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Layout from "./component/Layout";
import { ToastContainer } from "react-toastify";

import Login from "./auth/Login";
import { lazy, Suspense } from "react";
import Spinner from "./component/Spinner";
import PrivateRoute from "./component/PrivateRoute";

const TeacherAddListing = lazy(() => import("./pages/TeacherAddListing"));
const CoursesAddListing=lazy(()=>import('./pages/CoursesAddListing'))

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

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />{" "}
                </PrivateRoute>
              }
            />

            <Route
              path="/teacher"
              element={
                <Suspense fallback={<Spinner />}>
                  <PrivateRoute>
                    <TeacherAddListing />
                  </PrivateRoute>
                </Suspense>
              }
            />

            <Route path="/courses" element={<Suspense fallback={<Spinner />}> <CoursesAddListing />  </Suspense>} />
          </Route>

          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
