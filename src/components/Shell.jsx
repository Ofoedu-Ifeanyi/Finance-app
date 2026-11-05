import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Shell() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell-main">
        <header className="topbar">
          <h1>Personal Finance</h1>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}