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
} from "lucide-react";
import { useParams } from "react-router";
import { AuthenticationService } from "../Service/AuthencationService";
import { Api } from "../Service/ApiService";
import { FaToiletPaper } from "react-icons/fa";

// ✅ Proper PDF.js worker setup for Vite + TypeScript
// Add this declaration once globally (in `global.d.ts` file):
// declare module "pdfjs-dist/build/pdf.worker.min.mjs";
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
  const [pdfUrl, setPdfUrl] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const viewerRef = useRef<HTMLDivElement | null>(null);
  const { Title} = useParams();

  /** ✅ When PDF loads successfully */
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  /** ✅ Fetch course details (and PDF URL) from backend */
  async function getCourseByTitle() {
    try {
      if(await AuthenticationService.isAuthenticated()){
      const response = await Api("course/searchCourseByTitle",  {Title});

      const course = response.data[0]
      console.log(course)
      if (course) {
        setCourseTitle(course.title);
        setPdfUrl(course.contentUrl);
      } else {
        console.warn("No course found for title:", Title);
      }
    } 
      }
      catch (error) {
      console.error("Error fetching course:", error);
    }
      

     
  }

  /** ✅ Download the PDF */
  const handleDownload = async () => {
    if (!pdfUrl) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${courseTitle || "course"}.pdf`;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  /** ✅ Toggle Fullscreen */
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
    <div
      ref={viewerRef}
      className={`min-h-screen flex flex-col items-center transition-all duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } p-4`}
    >
      {/* ✅ Toolbar */}
      <div
        className={`w-full max-w-5xl shadow-md rounded-xl p-4 flex items-center justify-between sticky top-0 z-20 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-lg font-semibold">📘 {courseTitle || "Course PDF"}</h2>

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
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

          {/* Page Navigation */}
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

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle Fullscreen"
          >
            {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={!pdfUrl}
            className={`ml-3 p-2 rounded-full ${
              pdfUrl
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* ✅ PDF Viewer */}
      <div className="w-full flex justify-center mt-6">
        <div
          className={`p-3 rounded-lg shadow-inner overflow-auto max-h-[85vh] w-full max-w-5xl ${
            darkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          {!pdfUrl ? (
            <p
              className={`text-center ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading PDF...
            </p>
          ) : (
            <Document
              file={pdfUrl}
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
  );
}
