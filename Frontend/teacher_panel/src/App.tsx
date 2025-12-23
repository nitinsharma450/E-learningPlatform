import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./component/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import CourseAddPage from "./pages/CourseAddPage";
import QuizAddPage from "./pages/QuizAddPage";

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
            <Route path="/course" element={<CourseAddPage />} />
            <Route path="/quizupload" element={<QuizAddPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
