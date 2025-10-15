import { Outlet } from "react-router"
 
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Layout() {
  return (
   <>
   <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <Outlet />
      </div>
    </div>
   
   </>
  )
}
