import { BrowserRouter, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import Spinner from "./components/Spinner";
import { ToastContainer } from "react-toastify";

import ReadCourse from "./pages/ReadCourse";
import EnrolledCourse from "./pages/EnrolledCourse";
import Layout from "./components/Layout";

const LazyDashboard = lazy(() => import("./pages/Dashboard"));
const LazyLogin = lazy(() => import("./pages/Login"));

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LazyLogin />} />

            {/* Layout Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<LazyDashboard />} />
              <Route path="/enrolledCourse" element={<EnrolledCourse />} />
              <Route
                path="/course/:coursetitle/:courseId"
                element={<ReadCourse />}
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
