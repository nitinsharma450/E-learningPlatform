import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  Moon,
  Sun,
  Send,
} from "lucide-react";
import { useParams } from "react-router";
import { AuthenticationService } from "../Service/AuthencationService";
import { Api } from "../Service/ApiService";
import Spinner from "../components/Spinner";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

export default function CoursePDFViewer() {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [pdfList, setPdfList] = useState<any[]>([]); // ✅ multiple PDFs
  const [selectedPdf, setSelectedPdf] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const [userPrompt, setUserPrompt] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(false);
  const [message, setMessage] = useState<{ role: String; content: String }[]>([]);

  const viewerRef = useRef<HTMLDivElement | null>(null);
  const { coursetitle } = useParams();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  async function askDoubt() {
    if (!userPrompt.trim()) return;

    setLoading(true);
    const prompt = userPrompt;
    setUserPrompt("");

    setMessage((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      if (await AuthenticationService.isAuthenticated()) {
        const response = await Api("doubt/aichat", { userPrompt: prompt });
        const aiMessage = response?.data || "No response from AI.";
        setMessage((prev) => [...prev, { role: "AI", content: aiMessage }]);
      }
    } catch (error) {
      console.error("Error in askDoubt:", error);
      setMessage((prev) => [
        ...prev,
        { role: "AI", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  /** ✅ Fetch all PDFs for this course */
  async function getCourseByTitle() {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        console.log('title is :',courseTitle)
        const response = await Api("course/searchCourseByTitle", { title:coursetitle });
        const courses = response.data;

        console.log("Fetched PDFs:", courses);

        if (Array.isArray(courses) && courses.length > 0) {
          setPdfList(courses);
          setSelectedPdf(courses[0].contentUrl);
          setCourseTitle(courses[0].title);
        } else {
          console.warn("No course PDFs found for:", courseTitle);
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  }

  const handleDownload = async () => {
    if (!selectedPdf) return;
    try {
      const response = await fetch(selectedPdf);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${courseTitle || "course"}.pdf`;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen();
      setFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    getCourseByTitle();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-center items-start gap-4 p-4 min-h-screen transition-all duration-300">
        {/* 🧠 AI Chat Section */}
        <div
          className={`flex flex-col justify-between rounded-2xl shadow-lg w-80 h-[90vh] border transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🤖 AI Chat
            </h2>
            <button
              onClick={() => setMessage([])}
              className="text-sm text-blue-500 hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {message.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">
                Ask anything about this course!
              </p>
            ) : (
              message.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : darkMode
                        ? "bg-gray-700 text-gray-100 rounded-bl-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-3 flex items-center gap-2">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask your question..."
              className={`w-full rounded-xl px-3 py-2 outline-none border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-800"
              }`}
            />
            <button
              onClick={askDoubt}
              className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition"
            >
              {loading ? <Spinner /> : <Send size={18} />}
            </button>
          </div>
        </div>

        {/* 📘 PDF Viewer Section */}
        <div
          ref={viewerRef}
          className={`flex flex-col items-center w-full max-w-5xl min-h-screen rounded-xl shadow-lg transition-all duration-300 ${
            darkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {/* ✅ Toolbar */}
          <div
            className={`w-full shadow-md rounded-t-xl p-4 flex items-center justify-between sticky top-0 z-20 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-lg font-semibold">
              📘 {courseTitle || "Course PDF"}
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>

              <button
                onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                disabled={pageNumber <= 1}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
                title="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium">
                {pageNumber} / {numPages || "?"}
              </span>
              <button
                onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
                title="Next Page"
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Toggle Fullscreen"
              >
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>

              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={handleDownload}
                disabled={!selectedPdf}
                className={`ml-3 p-2 rounded-full ${
                  selectedPdf
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                title="Download PDF"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* ✅ Multiple PDFs Selector */}
          {pdfList.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {pdfList.map((pdf:any, index) => (
                <button
                  key={pdf._id}
                  onClick={() => setSelectedPdf(pdf.contentUrl)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                    selectedPdf === pdf.contentUrl
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  📄 Module {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* ✅ PDF Viewer */}
          <div className="w-full flex justify-center mt-6">
            <div
              className={`p-3 rounded-lg shadow-inner overflow-auto max-h-[85vh] w-full max-w-5xl ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              {!selectedPdf ? (
                <p
                  className={`text-center ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                 NO RESOURCE FOUND
                </p>
              ) : (
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(err) => console.error("PDF Load Error:", err)}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
