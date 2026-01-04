import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="">
      <Header />

      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

