import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function GuestLayout() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white text-slate-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
